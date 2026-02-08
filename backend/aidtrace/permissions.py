from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners to edit objects / صلاحية مخصصة للسماح للمالكين فقط بتعديل الكائنات"""
    
    def has_object_permission(self, request, view, obj):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only to the owner
        if hasattr(obj, 'organisation'):
            return obj.organisation == request.user.organisation
        elif hasattr(obj, 'donor'):
            return obj.donor == request.user
        elif hasattr(obj, 'submitted_by'):
            return obj.submitted_by == request.user
        elif hasattr(obj, 'field_officer'):
            return obj.field_officer == request.user
        
        return False

class IsAdminOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow admins to edit / صلاحية مخصصة للسماح للمشرفين فقط بالتعديل"""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'admin'

class IsOrganisationMember(permissions.BasePermission):
    """Permission for organisation members / صلاحية لأعضاء المنظمة"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['organisation', 'field_officer']

class IsDonor(permissions.BasePermission):
    """Permission for donors / صلاحية للمتبرعين"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'donor'

class IsFieldOfficer(permissions.BasePermission):
    """Permission for field officers / صلاحية للموظفين الميدانيين"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'field_officer'