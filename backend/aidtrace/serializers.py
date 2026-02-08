from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Organisation, Project, FundingTransaction, Report, VerificationRecord, AuditLog, AidDistribution

# User serializers / مسلسلات المستخدم
class UserSerializer(serializers.ModelSerializer):
    organisation_name = serializers.CharField(source='organisation.name', read_only=True, allow_null=True)
    organisation_id = serializers.IntegerField(source='organisation.id', read_only=True, allow_null=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'organisation', 'organisation_id', 'organisation_name', 'phone', 'is_approved', 'created_at']
        read_only_fields = ['id', 'created_at']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role', 'organisation', 'phone']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        role = validated_data.get('role')
        
        # Admin accounts are auto-approved, others need approval
        if role == 'admin':
            validated_data['is_approved'] = True
        else:
            validated_data['is_approved'] = False
        
        # Create organisation for organisation users only if not provided
        if role == 'organisation' and 'organisation' not in validated_data:
            from .models import Organisation
            org = Organisation.objects.create(
                name=validated_data.get('username'),
                type='ngo',
                registration_status='approved',
                contact_email=validated_data.get('email'),
                description=f'Organisation for {validated_data.get("username")}'
            )
            validated_data['organisation'] = org
        
        # For field officers, organisation must be provided as ID
        if role == 'field_officer' and 'organisation' in validated_data:
            from .models import Organisation
            org_id = validated_data['organisation']
            if isinstance(org_id, int):
                validated_data['organisation'] = Organisation.objects.get(id=org_id)
            
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

# Organisation serializers / مسلسلات المنظمة
class OrganisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = '__all__'

# Project serializers / مسلسلات المشروع
class ProjectSerializer(serializers.ModelSerializer):
    organisation_name = serializers.CharField(source='organisation.name', read_only=True)
    total_funded = serializers.ReadOnlyField()
    funding_progress = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['organisation', 'created_at', 'updated_at']

class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title', 'description', 'budget', 'location', 'sector', 'beneficiaries', 'start_date', 'end_date']

# Funding Transaction serializers / مسلسلات معاملة التمويل
class FundingTransactionSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source='donor.get_full_name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = FundingTransaction
        fields = '__all__'

class FundingTransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundingTransaction
        fields = ['project', 'amount']

# Report serializers / مسلسلات التقرير
class ReportSerializer(serializers.ModelSerializer):
    submitted_by_name = serializers.CharField(source='submitted_by.get_full_name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = Report
        fields = '__all__'

class ReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['project', 'type', 'title', 'content_summary']

# Verification Record serializers / مسلسلات سجل التوثيق
class VerificationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRecord
        fields = '__all__'

# Audit Log serializers / مسلسلات سجل التدقيق
class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = AuditLog
        fields = '__all__'

# Aid Distribution serializers / مسلسلات توزيع المساعدات
class AidDistributionSerializer(serializers.ModelSerializer):
    field_officer_name = serializers.CharField(source='field_officer.get_full_name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = AidDistribution
        fields = '__all__'

class AidDistributionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AidDistribution
        fields = ['project', 'beneficiaries_count', 'aid_type', 'quantity', 'location', 'notes']

# Dashboard statistics serializers / مسلسلات إحصائيات لوحة التحكم
class DashboardStatsSerializer(serializers.Serializer):
    total_projects = serializers.IntegerField()
    active_projects = serializers.IntegerField()
    total_funding = serializers.DecimalField(max_digits=12, decimal_places=2)
    verified_reports = serializers.IntegerField()
    total_beneficiaries = serializers.IntegerField()