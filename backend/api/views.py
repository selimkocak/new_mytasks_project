# backend\api\views.py
from rest_framework import permissions
from rest_framework import viewsets
from .models import Task, Team, Membership
from .serializers import TaskSerializer, TeamSerializer, MembershipSerializer
from .permissions import IsTaskOwner, IsTeamManager, IsAdminUser, IsTeamLeader, IsTeamLeaderOrAdmin
from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from custom_user.models import Role, AppUser
from django.core.exceptions import ValidationError
from rest_framework.decorators import action

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner, IsTeamLeader]

    def get_queryset(self):
        user = self.request.user
        owned_tasks = Task.objects.filter(user=user)
        # Takıma bağlı görevlerin her takım üyesine görünür olması
        team_tasks = Task.objects.filter(team__members=user)
        return owned_tasks.union(team_tasks)

    def assign_task_to_team_members(self, team_id, task):
        team_members = Membership.objects.filter(team_id=team_id)
        for member in team_members:
            task.team_membership.add(member)

    def create(self, request, *args, **kwargs):
        user = request.user
        team_id = request.data.get('team', None)

        if not team_id:
            raise ValidationError("Görevin takımı belirtilmelidir.")

        team = Team.objects.filter(id=team_id).first()

        if not team:
            raise ValidationError("Belirtilen takım bulunamadı.")

        membership = Membership.objects.filter(user=user, team=team).first()

        if not membership:
            raise ValidationError("Kullanıcı, belirtilen takımın üyesi değildir.")
        
        # Task'ı kaydedip task nesnesini alalım.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()

        # Takım üyelerine görevi atayalım.
        self.assign_task_to_team_members(team_id, task)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def perform_update(self, serializer):
        user = self.request.user
        team_id = self.request.data.get('team', None)

        if not team_id:
            raise ValidationError("Görevin takımı belirtilmelidir.")

        team = Team.objects.filter(id=team_id).first()

        if not team:
            raise ValidationError("Belirtilen takım bulunamadı.")

        membership = Membership.objects.filter(user=user, team=team).first()

        if not membership:
            raise ValidationError("Kullanıcı, belirtilen takımın üyesi değildir.")

        serializer.save()

    def partial_update(self, request, *args, **kwargs):
            team = self.get_object()
            if not self._is_team_leader_or_manager(request.user, team):
                return Response({"detail": "Yalnızca takım lideri veya yönetici bu işlemi gerçekleştirebilir."},
                                status=status.HTTP_403_FORBIDDEN)

            return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        team = self.get_object()
        if not self._is_team_leader_or_manager(request.user, team):
            return Response({"detail": "Yalnızca takım lideri veya yönetici bu işlemi gerçekleştirebilir."},
                            status=status.HTTP_403_FORBIDDEN)

        return super().destroy(request, *args, **kwargs)


    def _is_task_owner(self, user, task):
        return task.user == user

    def _is_team_leader(self, user, task):
        team = task.team_membership.team
        membership = team.memberships.filter(user=user, role=Role.TEAM_LEADER.value).first()
        return membership is not None
    
    def filter_tasks_by_team(self, team_id):
        user = self.request.user
        owned_tasks = Task.objects.filter(user=user, team=team_id)
        team_tasks = Task.objects.filter(team__members=user, team=team_id)
        return owned_tasks.union(team_tasks)

    def list(self, request, *args, **kwargs):
        team_id = request.query_params.get('team', None)
        if team_id:
            queryset = self.filter_tasks_by_team(team_id)
        else:
            queryset = self.get_queryset()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    




class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamManager | permissions.IsAdminUser, IsTeamLeaderOrAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        team = serializer.save()

        # Takım liderini takım üyelerine ekleyin
        team_leader_email = request.data.get('team_leader', None)
        if team_leader_email:
            team_leader = AppUser.objects.filter(email=team_leader_email).first()
            if team_leader:
                existing_membership = Membership.objects.filter(user=team_leader, team=team).first()
                if not existing_membership:
                    Membership.objects.create(user=team_leader, team=team, role=Role.TEAM_LEADER.value)

        # Takım üyelerini takıma ekleyin
        for member_email in request.data.get('team_members', []):
            user = AppUser.objects.filter(email=member_email).first()
            if user:
                existing_membership = Membership.objects.filter(user=user, team=team).first()
                if not existing_membership:
                    Membership.objects.create(user=user, team=team, role=Role.TEAM_MEMBER.value)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        team = self.get_object()

        if not self._is_team_leader_or_manager(request.user, team):
            return Response({"detail": "Yalnızca takım lideri veya yönetici bu işlemi gerçekleştirebilir."},
                            status=status.HTTP_403_FORBIDDEN)

        return super().update(request, *args, **kwargs)

    def _is_team_leader_or_manager(self, user, team):
        membership = team.memberships.filter(user=user).first()
        return membership is not None and (membership.role == Role.TEAM_LEADER.value or membership.role == Role.TEAM_MANAGER.value)

    def get_user_teams(self, user):
        manager_teams = user.manager_teams.filter(membership__user=user)
        member_teams = user.member_teams.filter(membership__user=user)
        return manager_teams.union(member_teams)

    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()
    
    @action(detail=True, methods=['post'], permission_classes=[IsTeamLeaderOrAdmin])
    def add_member(self, request, pk=None):
        team = self.get_object()
        user_email = request.data.get('user_email')
        role = request.data.get('role', Role.TEAM_MEMBER.value)

        user = AppUser.objects.filter(email=user_email).first()
        if not user:
            return Response({"detail": "Kullanıcı bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

        team.add_member(user, role)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], permission_classes=[IsTeamLeaderOrAdmin])
    def set_leader(self, request, pk=None):
        team = self.get_object()
        user_email = request.data.get('user_email')

        user = AppUser.objects.filter(email=user_email).first()
        if not user:
            return Response({"detail": "Kullanıcı bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

        try:
            team.set_leader(user)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], permission_classes=[IsTeamLeaderOrAdmin])
    def remove_member(self, request, pk=None):
        team = self.get_object()
        user_email = request.data.get('user_email')

        user = AppUser.objects.filter(email=user_email).first()
        if not user:
            return Response({"detail": "Kullanıcı bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

        team.remove_member(user)
        return Response(status=status.HTTP_204_NO_CONTENT)



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
        teams = manager_teams.union(member_teams)

        # Filtreleme işlemi
        filter_type = self.request.query_params.get('filter', None)
        if filter_type == 'manager':
            return manager_teams
        elif filter_type == 'member':
            return member_teams
        else:
            return teams

