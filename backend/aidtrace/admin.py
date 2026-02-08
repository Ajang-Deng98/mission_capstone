from django.contrib import admin
from .models import User, Organisation, Project, FundingTransaction, Report, VerificationRecord, AuditLog, AidDistribution

# User admin / إدارة المستخدم
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'organisation', 'created_at']
    list_filter = ['role', 'organisation', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']

# Organisation admin / إدارة المنظمة
@admin.register(Organisation)
class OrganisationAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'registration_status', 'created_at']
    list_filter = ['type', 'registration_status', 'created_at']
    search_fields = ['name', 'contact_email']

# Project admin / إدارة المشروع
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'organisation', 'status', 'budget', 'location', 'created_at']
    list_filter = ['status', 'organisation', 'location', 'created_at']
    search_fields = ['title', 'description', 'location']

# Funding Transaction admin / إدارة معاملة التمويل
@admin.register(FundingTransaction)
class FundingTransactionAdmin(admin.ModelAdmin):
    list_display = ['donor', 'project', 'amount', 'date', 'is_verified']
    list_filter = ['is_verified', 'date', 'project__organisation']
    search_fields = ['donor__username', 'project__title']

# Report admin / إدارة التقرير
@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'submitted_by', 'type', 'submission_date', 'is_verified']
    list_filter = ['type', 'is_verified', 'submission_date', 'project__organisation']
    search_fields = ['title', 'content_summary', 'project__title']

# Verification Record admin / إدارة سجل التوثيق
@admin.register(VerificationRecord)
class VerificationRecordAdmin(admin.ModelAdmin):
    list_display = ['entity_type', 'entity_id', 'hash_value', 'is_verified', 'timestamp']
    list_filter = ['entity_type', 'is_verified', 'timestamp']
    search_fields = ['hash_value', 'blockchain_tx_id']

# Audit Log admin / إدارة سجل التدقيق
@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'timestamp', 'ip_address']
    list_filter = ['action', 'timestamp']
    search_fields = ['user__username', 'action', 'details']

# Aid Distribution admin / إدارة توزيع المساعدات
@admin.register(AidDistribution)
class AidDistributionAdmin(admin.ModelAdmin):
    list_display = ['project', 'field_officer', 'aid_type', 'quantity', 'beneficiaries_count', 'distribution_date', 'is_verified']
    list_filter = ['aid_type', 'is_verified', 'distribution_date', 'project__organisation']
    search_fields = ['project__title', 'aid_type', 'location']