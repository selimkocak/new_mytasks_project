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
from custom_user.models import Role

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamManager | permissions.IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            team = serializer.save()
            team_membership = Membership(user=request.user, team=team, role=Role.TEAM_MANAGER.value)
            team_membership.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        manager_teams = user.manager_teams.all()
        member_teams = user.member_teams.all()
        return manager_teams.union(member_teams)
