# backend\api\views\user_teams_views.py kodlarım
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from api.models import AppUser, Membership, Team
from api.serializers import TeamSerializer

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