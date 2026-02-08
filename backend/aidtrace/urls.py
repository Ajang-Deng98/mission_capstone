from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# Blockchain views with error handling
try:
    from . import blockchain_views
    BLOCKCHAIN_VIEWS_ENABLED = True
except ImportError:
    BLOCKCHAIN_VIEWS_ENABLED = False

# API URL patterns / أنماط عناوين API
urlpatterns = [
    # Authentication endpoints / نقاط المصادقة
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Dashboard endpoints / نقاط لوحة التحكم
    path('dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),
    
    # Public endpoints / النقاط العامة
    path('public/projects/', views.public_projects, name='public_projects'),
    path('public/stats/', views.public_stats, name='public_stats'),
    
    # Organisation endpoints / نقاط المنظمة
    path('organisations/', views.OrganisationListCreateView.as_view(), name='organisation_list'),
    path('organisations/<int:pk>/', views.OrganisationDetailView.as_view(), name='organisation_detail'),
    
    # Project endpoints / نقاط المشروع
    path('projects/', views.ProjectListCreateView.as_view(), name='project_list'),
    path('projects/<int:pk>/', views.ProjectDetailView.as_view(), name='project_detail'),
    
    # Funding endpoints / نقاط التمويل
    path('funding/', views.FundingTransactionListCreateView.as_view(), name='funding_list'),
    
    # Report endpoints / نقاط التقرير
    path('reports/', views.ReportListCreateView.as_view(), name='report_list'),
    
    # Aid distribution endpoints / نقاط توزيع المساعدات
    path('distributions/', views.AidDistributionListCreateView.as_view(), name='distribution_list'),
    
    # Verification endpoints / نقاط التوثيق
    path('verifications/', views.VerificationRecordListView.as_view(), name='verification_list'),
    
    # Audit endpoints / نقاط التدقيق
    path('audit/', views.AuditLogListView.as_view(), name='audit_list'),
    
    # User management endpoints / نقاط إدارة المستخدمين
    path('users/', views.UserListView.as_view(), name='user_list'),
]

# Add blockchain endpoints if available
if BLOCKCHAIN_VIEWS_ENABLED:
    urlpatterns.extend([
        path('blockchain/stats/', blockchain_views.blockchain_stats, name='blockchain_stats'),
        path('blockchain/verify/', blockchain_views.verify_hash, name='verify_hash'),
        path('blockchain/batch-verify/', blockchain_views.batch_verify, name='batch_verify'),
    ])