from rest_framework import generics, status, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Sum, Count
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, Organisation, Project, FundingTransaction, Report, VerificationRecord, AuditLog, AidDistribution
from .serializers import (
    UserSerializer, UserRegistrationSerializer, OrganisationSerializer,
    ProjectSerializer, ProjectCreateSerializer, FundingTransactionSerializer, FundingTransactionCreateSerializer,
    ReportSerializer, VerificationRecordSerializer, AuditLogSerializer, AidDistributionSerializer
)
from .permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly

# Blockchain integration with error handling
try:
    from .blockchain import create_verification_hash, store_on_blockchain
    BLOCKCHAIN_ENABLED = True
except ImportError as e:
    print(f"Blockchain disabled due to import error: {e}")
    BLOCKCHAIN_ENABLED = False
    def create_verification_hash(obj): return None
    def store_on_blockchain(hash_val): return f"sim_{hash_val[:16]}" if hash_val else None

# Authentication views / عروض المصادقة
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Account created successfully. Awaiting admin approval.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        if not user.is_approved and user.role != 'admin':
            return Response({'error': 'Account pending admin approval'}, status=status.HTTP_403_FORBIDDEN)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Dashboard views / عروض لوحة التحكم
@api_view(['GET'])
def dashboard_stats(request):
    user = request.user
    stats = {}
    
    if user.role == 'donor':
        stats = {
            'total_funding': FundingTransaction.objects.filter(donor=user).aggregate(Sum('amount'))['amount__sum'] or 0,
            'active_projects': Project.objects.filter(fundingtransaction__donor=user, status='active').distinct().count(),
            'verified_reports': Report.objects.filter(project__fundingtransaction__donor=user, is_verified=True).distinct().count(),
        }
    elif user.role == 'organisation':
        stats = {
            'active_projects': Project.objects.filter(organisation=user.organisation, status='active').count(),
            'funds_received': FundingTransaction.objects.filter(project__organisation=user.organisation).aggregate(Sum('amount'))['amount__sum'] or 0,
            'reports_submitted': Report.objects.filter(project__organisation=user.organisation).count(),
        }
    elif user.role == 'field_officer':
        stats = {
            'assigned_projects': Project.objects.filter(organisation=user.organisation, status='active').count(),
            'distributions_recorded': AidDistribution.objects.filter(field_officer=user).count(),
            'reports_submitted': Report.objects.filter(submitted_by=user).count(),
        }
    elif user.role == 'admin':
        stats = {
            'total_projects': Project.objects.count(),
            'pending_approvals': Project.objects.filter(status='pending').count(),
            'total_funding': FundingTransaction.objects.aggregate(Sum('amount'))['amount__sum'] or 0,
            'total_users': User.objects.count(),
        }
    
    return Response(stats)

# Organisation views / عروض المنظمة
class OrganisationListCreateView(generics.ListCreateAPIView):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type', 'registration_status']

class OrganisationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    permission_classes = [IsAdminOrReadOnly]

# Project views / عروض المشروع
class ProjectListCreateView(generics.ListCreateAPIView):
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['organisation', 'location']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectCreateSerializer
        return ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = None
        
        if user.role == 'admin':
            queryset = Project.objects.all()
        elif user.role == 'organisation':
            queryset = Project.objects.filter(organisation=user.organisation)
        elif user.role == 'field_officer':
            queryset = Project.objects.filter(organisation=user.organisation)
        else:  # donor or public
            queryset = Project.objects.filter(status__in=['approved', 'active', 'completed'])
        
        # Handle comma-separated status filter
        status_param = self.request.query_params.get('status', None)
        if status_param:
            status_list = [s.strip() for s in status_param.split(',')]
            queryset = queryset.filter(status__in=status_list)
        
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user
        print(f"User: {user.username}, Role: {user.role}, Org: {user.organisation}")
        
        if user.role != 'organisation':
            raise serializers.ValidationError({'error': 'Only organisation users can create projects'})
        
        # If user doesn't have organisation, create one from their username
        if not user.organisation:
            from .models import Organisation
            org, created = Organisation.objects.get_or_create(
                name=user.username,
                defaults={
                    'type': 'ngo',
                    'registration_status': 'approved',
                    'contact_email': user.email or f'{user.username}@example.com',
                    'description': f'Organisation for {user.username}'
                }
            )
            user.organisation = org
            user.save()
            print(f"Created/assigned organisation: {org.name}")
            
        serializer.save(organisation=user.organisation, status='pending')

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Project.objects.all().order_by('-created_at')
        elif user.role in ['organisation', 'field_officer']:
            return Project.objects.filter(organisation=user.organisation).order_by('-created_at')
        else:
            return Project.objects.filter(status__in=['approved', 'active', 'completed']).order_by('-created_at')

# Funding Transaction views / عروض معاملة التمويل
class FundingTransactionListCreateView(generics.ListCreateAPIView):
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project', 'is_verified']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FundingTransactionCreateSerializer
        return FundingTransactionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return FundingTransaction.objects.all()
        elif user.role == 'donor':
            return FundingTransaction.objects.filter(donor=user)
        elif user.role in ['organisation', 'field_officer']:
            return FundingTransaction.objects.filter(project__organisation=user.organisation)
        return FundingTransaction.objects.none()

    def perform_create(self, serializer):
        transaction = serializer.save(donor=self.request.user)
        
        # Create blockchain verification
        if BLOCKCHAIN_ENABLED:
            hash_value = create_verification_hash(transaction)
            blockchain_tx = store_on_blockchain(hash_value)
            VerificationRecord.objects.create(
                entity_type='transaction',
                entity_id=transaction.id,
                hash_value=hash_value,
                blockchain_tx_id=blockchain_tx
            )

# Report views / عروض التقرير
class ReportListCreateView(generics.ListCreateAPIView):
    serializer_class = ReportSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project', 'type', 'is_verified']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Report.objects.all()
        elif user.role == 'donor':
            return Report.objects.filter(project__fundingtransaction__donor=user).distinct()
        elif user.role in ['organisation', 'field_officer']:
            return Report.objects.filter(project__organisation=user.organisation)
        return Report.objects.none()

    def perform_create(self, serializer):
        report = serializer.save(submitted_by=self.request.user)
        # Create blockchain verification
        if BLOCKCHAIN_ENABLED:
            hash_value = create_verification_hash(report)
            blockchain_tx = store_on_blockchain(hash_value)
            VerificationRecord.objects.create(
                entity_type='report',
                entity_id=report.id,
                hash_value=hash_value,
                blockchain_tx_id=blockchain_tx
            )

# Aid Distribution views / عروض توزيع المساعدات
class AidDistributionListCreateView(generics.ListCreateAPIView):
    serializer_class = AidDistributionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project', 'aid_type', 'is_verified']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return AidDistribution.objects.all()
        elif user.role == 'field_officer':
            return AidDistribution.objects.filter(field_officer=user)
        elif user.role == 'organisation':
            return AidDistribution.objects.filter(project__organisation=user.organisation)
        elif user.role == 'donor':
            return AidDistribution.objects.filter(project__fundingtransaction__donor=user).distinct()
        return AidDistribution.objects.none()

    def perform_create(self, serializer):
        distribution = serializer.save(field_officer=self.request.user)
        # Create blockchain verification
        if BLOCKCHAIN_ENABLED:
            hash_value = create_verification_hash(distribution)
            blockchain_tx = store_on_blockchain(hash_value)
            VerificationRecord.objects.create(
                entity_type='distribution',
                entity_id=distribution.id,
                hash_value=hash_value,
                blockchain_tx_id=blockchain_tx
            )

# Verification views / عروض التوثيق
class VerificationRecordListView(generics.ListAPIView):
    serializer_class = VerificationRecordSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['entity_type', 'is_verified']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return VerificationRecord.objects.all()
        return VerificationRecord.objects.filter(is_verified=True)

# Audit Log views / عروض سجل التدقيق
class AuditLogListView(generics.ListAPIView):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'action']

# Public views (no authentication required) / العروض العامة
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_projects(request):
    projects = Project.objects.filter(status__in=['approved', 'active', 'completed'])
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_stats(request):
    stats = {
        'total_projects': Project.objects.filter(status__in=['approved', 'active', 'completed']).count(),
        'total_funding': FundingTransaction.objects.aggregate(Sum('amount'))['amount__sum'] or 0,
        'active_projects': Project.objects.filter(status='active').count(),
        'completed_projects': Project.objects.filter(status='completed').count(),
    }
    return Response(stats)

# User management views / عروض إدارة المستخدمين
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role', 'organisation']
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        elif user.role == 'organisation':
            # Organisation can see their own field officers
            return User.objects.filter(organisation=user.organisation, role='field_officer')
        return User.objects.none()