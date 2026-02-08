from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# User model / نموذج المستخدم
class User(AbstractUser):
    ROLE_CHOICES = [
        ('donor', 'Donor / متبرع'),
        ('organisation', 'Organisation / منظمة'),
        ('field_officer', 'Field Officer / موظف ميداني'),
        ('admin', 'Admin / مشرف'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    organisation = models.ForeignKey('Organisation', on_delete=models.SET_NULL, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

# Organisation model / نموذج المنظمة
class Organisation(models.Model):
    TYPE_CHOICES = [
        ('ngo', 'NGO / منظمة غير حكومية'),
        ('government', 'Government / حكومة'),
        ('international', 'International / دولية'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending / قيد الانتظار'),
        ('approved', 'Approved / تمت الموافقة'),
        ('rejected', 'Rejected / مرفوض'),
    ]
    
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    registration_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    description = models.TextField(blank=True)
    contact_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Project model / نموذج المشروع
class Project(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft / مسودة'),
        ('pending', 'Pending / قيد الانتظار'),
        ('approved', 'Approved / تمت الموافقة'),
        ('active', 'Active / نشط'),
        ('completed', 'Completed / مكتمل'),
        ('cancelled', 'Cancelled / ملغي'),
    ]
    
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    budget = models.DecimalField(max_digits=12, decimal_places=2)
    location = models.CharField(max_length=200)
    sector = models.CharField(max_length=100, blank=True)
    beneficiaries = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    @property
    def total_funded(self):
        return self.fundingtransaction_set.aggregate(
            total=models.Sum('amount')
        )['total'] or 0

    @property
    def funding_progress(self):
        return (self.total_funded / self.budget * 100) if self.budget > 0 else 0

# Funding Transaction model / نموذج معاملة التمويل
class FundingTransaction(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    donor = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(default=timezone.now)
    transaction_hash = models.CharField(max_length=100, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.donor.username} - ${self.amount} - {self.project.title}"

# Report model / نموذج التقرير
class Report(models.Model):
    TYPE_CHOICES = [
        ('progress', 'Progress Report / تقرير تقدم'),
        ('financial', 'Financial Report / تقرير مالي'),
        ('field', 'Field Report / تقرير ميداني'),
        ('completion', 'Completion Report / تقرير إنجاز'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    content_summary = models.TextField()
    submission_date = models.DateTimeField(default=timezone.now)
    is_verified = models.BooleanField(default=False)
    verification_hash = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.title} - {self.project.title}"

# Verification Record model / نموذج سجل التوثيق
class VerificationRecord(models.Model):
    ENTITY_CHOICES = [
        ('transaction', 'Transaction / معاملة'),
        ('report', 'Report / تقرير'),
        ('project', 'Project / مشروع'),
    ]
    
    entity_type = models.CharField(max_length=20, choices=ENTITY_CHOICES)
    entity_id = models.PositiveIntegerField()
    hash_value = models.CharField(max_length=100)
    blockchain_tx_id = models.CharField(max_length=100, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.entity_type} - {self.entity_id} - {self.hash_value[:10]}..."

# Audit Log model / نموذج سجل التدقيق
class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=200)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.timestamp}"

# Aid Distribution model / نموذج توزيع المساعدات
class AidDistribution(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    field_officer = models.ForeignKey(User, on_delete=models.CASCADE)
    beneficiaries_count = models.PositiveIntegerField()
    aid_type = models.CharField(max_length=100)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    distribution_date = models.DateTimeField(default=timezone.now)
    location = models.CharField(max_length=200)
    notes = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.aid_type} - {self.project.title} - {self.distribution_date}"