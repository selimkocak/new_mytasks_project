# backend\api\views.py
from rest_framework import permissions
from rest_framework import viewsets
from .models import Task, Team, Membership
from .serializers import TaskSerializer, TeamSerializer, MembershipSerializer
from .permissions import IsTaskOwner, IsTeamManager, IsAdminUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from custom_user.models import Role, AppUser

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(user=user)

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamManager | permissions.IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        team = serializer.save()

        existing_membership = Membership.objects.filter(user=request.user, team=team).first()
        if not existing_membership:
            Membership.objects.create(user=request.user, team=team, role=Role.TEAM_MANAGER.value)

        for member_email in request.data.get('team_members', []):
            user = AppUser.objects.filter(email=member_email).first()
            if user:
                existing_membership = Membership.objects.filter(user=user, team=team).first()
                if not existing_membership:
                    Membership.objects.create(user=user, team=team, role=Role.TEAM_MEMBER.value)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_user_teams(self, user):
        manager_teams = user.manager_teams.filter(membership__user=user)
        member_teams = user.member_teams.filter(membership__user=user)
        return manager_teams.union(member_teams)

    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

class UserTeamsAPIView(generics.ListAPIView):
    serializer_class = TeamSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        manager_teams = user.manager_teams.filter(membership__user=user)
        member_teams = user.member_teams.filter(membership__user=user)

        return manager_teams.union(member_teams)

class UserFilteredTeamsAPIView(generics.ListAPIView):
    serializer_class = TeamSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        manager_teams = user.manager_teams.filter(membership__user=user)
        member_teams = user.member_teams.filter(membership__user=user)
        return manager_teams.union(member_teams)