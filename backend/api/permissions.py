# backend\api\permissions.py
from rest_framework import permissions
from custom_user.models import Role

class IsTaskOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class IsTeamManager(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method == 'POST':
            return True
        membership = obj.memberships.filter(user=request.user, role=Role.TEAM_MANAGER.value).first()
        return membership is not None

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == Role.ADMIN.value

    def has_object_permission(self, request, view, obj):
        return request.user.role == Role.ADMIN.value