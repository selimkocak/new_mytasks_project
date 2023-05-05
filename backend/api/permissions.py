# backend\api\permissions.py
from rest_framework import permissions
from custom_user.models import Role
from .models import Team

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

class IsTeamLeader(permissions.BasePermission):
    def has_permission(self, request, view):
            if request.method in permissions.SAFE_METHODS:
                return True

            team_id = request.query_params.get('team', None)
            if not team_id:
                return False

            team = Team.objects.filter(id=team_id).first()
            if not team:
                return False

            membership = team.memberships.filter(user=request.user, role=Role.TEAM_LEADER.value).first()
            return membership is not None

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        team_id = request.data.get('team', None)
        if not team_id:
            return False

        team = Team.objects.filter(id=team_id).first()
        if not team:
            return False

        membership = team.memberships.filter(user=request.user, role=Role.TEAM_LEADER.value).first()
        return membership is not None


class IsTeamLeaderOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        team_id = request.query_params.get('team', None)

        if not team_id:
            return False

        team = Team.objects.filter(id=team_id).first()
        if not team:
            return False

        membership = team.memberships.filter(user=user).first()

        if not membership:
            return False

        return membership.role in [Role.TEAM_LEADER.value, Role.ADMIN.value]

    def has_object_permission(self, request, view, obj):
        user = request.user
        membership = obj.memberships.filter(user=user).first()

        if not membership:
            return False

        return membership.role in [Role.TEAM_LEADER.value, Role.ADMIN.value]