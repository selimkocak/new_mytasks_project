# backend\api\views\team_views.py kodlarım
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from api.models import Team, Membership, AppUser, Role
from api.serializers import TeamSerializer
from api.permissions import IsTeamManager, IsTeamLeaderOrAdmin

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
    
    @action(detail=True, methods=['get'], permission_classes=[IsTeamLeaderOrAdmin])
    def get_project_duration(self, request, pk=None):
        team = self.get_object()
        project_duration_info = team.calculate_project_duration()
        if project_duration_info:
            return Response(project_duration_info, status=status.HTTP_200_OK)
        return Response({"detail": "Takımın görevleri bulunamadı."}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['get'], permission_classes=[IsTeamLeaderOrAdmin])
    def evaluate_performance(self, request, pk=None):
        team = self.get_object()
        performance_info = team.evaluate_performance()
        if performance_info:
            return Response(performance_info, status=status.HTTP_200_OK)
        return Response({"detail": "Takımın görevleri bulunamadı."}, status=status.HTTP_404_NOT_FOUND)