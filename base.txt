# backend\api\views\base.py kodlarım
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework import generics
from api.models import Task, Team, Membership
from api.serializers import TaskSerializer, TeamSerializer, MembershipSerializer
from api.permissions import IsTaskOwner, IsTeamManager, IsAdminUser, IsTeamLeader, IsTeamLeaderOrAdmin
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from custom_user.models import Role, AppUser
from django.core.exceptions import ValidationError
from rest_framework.decorators import action

class BaseTaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    def _is_task_owner(self, user, task):
        return task.user == user

    def _is_team_leader(self, user, task):
        team = task.team.team
        membership = team.memberships.filter(user=user, role=Role.TEAM_LEADER.value).first()
        return membership is not None

    def filter_tasks_by_team(self, team_id):
        user = self.request.user
        owned_tasks = Task.objects.filter(user=user, team=team_id)
        team_tasks = Task.objects.filter(team__members=user, team=team_id)
        return list(owned_tasks) + list(team_tasks)

    def filter_and_order_tasks(self, order_by=None, team_id=None):
        queryset = self.get_queryset()
        if team_id:
            queryset = self.filter_tasks_by_team(team_id)
        if order_by:
            queryset = self.order_tasks_by_params(queryset, order_by)
        return queryset

    def order_tasks_by_params(self, queryset, order_by):
        valid_order_by_params = ['created', '-created', 'status', '-status', 'due_date', '-due_date']
        if order_by not in valid_order_by_params:
            raise ValidationError("Geçersiz sıralama parametresi. Geçerli parametreler: 'created', '-created', 'status', '-status', 'due_date', '-due_date'")
        return queryset.order_by(order_by)


class BaseTeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamManager | permissions.IsAdminUser, IsTeamLeaderOrAdmin]

    def _is_team_leader_or_manager(self, user, team):
        membership = team.memberships.filter(user=user).first()
        return membership is not None and (membership.role == Role.TEAM_LEADER.value or membership.role == Role.TEAM_MANAGER.value)

    def get_user_teams(self, user):
        manager_teams = user.manager_teams.filter(membership__user=user)
        member_teams = user.member_teams.filter(membership__user=user)
        return manager_teams.union(member_teams)

class TeamMembersAPIView(generics.ListAPIView):
    serializer_class = MembershipSerializer
    permission_classes = (IsAuthenticated, IsTeamLeaderOrAdmin)

    def get_queryset(self):
        user = self.request.user
        team_id = self.kwargs['pk']
        team = Team.objects.get(id=team_id)

        if not self._is_team_leader_or_admin(user, team):
            return Membership.objects.none()

        return team.memberships.all()

    def _is_team_leader_or_admin(self, user, team):
        membership = team.memberships.filter(user=user).first()
        return membership is not None and (membership.role == Role.TEAM_LEADER.value or membership.role == Role.ADMIN.value)

class TeamTasksAPIView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated, IsTeamLeaderOrAdmin)

    def get_queryset(self):
        user = self.request.user
        team_id = self.kwargs['pk']
        team = Team.objects.get(id=team_id)

        if not self._is_team_leader_or_admin(user, team):
            return Task.objects.none()

        return team.tasks.all()

    def _is_team_leader_or_admin(self, user, team):
        membership = team.memberships.filter(user=user).first()
        return membership is not None and (membership.role == Role.TEAM_LEADER.value or membership.role == Role.ADMIN.value)

class TaskActions(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    @action(detail=True, methods=['post'], permission_classes=[IsTaskOwner | IsTeamLeader])
    def complete(self, request, pk=None):
        task = self.get_object()
        task.status = Task.Status.COMPLETED.value
        task.save()
        return Response({'status': 'Task completed successfully'})

    @action(detail=True, methods=['post'], permission_classes=[IsTaskOwner | IsTeamLeader])
    def reopen(self, request, pk=None):
        task = self.get_object()
        task.status = Task.Status.OPEN.value
        task.save()
        return Response({'status': 'Task reopened successfully'})

class AssignTaskToUser(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    @action(detail=True, methods=['post'], permission_classes=[IsTaskOwner | IsTeamLeader])
    def assign(self, request, pk=None, user_id=None):
        task = self.get_object()
        try:
            assignee = AppUser.objects.get(id=user_id)
        except AppUser.DoesNotExist:
            return Response({'error': 'Kullanıcı bulunamadı'}, status=status.HTTP_404_NOT_FOUND)

        task.user = assignee
        task.save()
        return Response({'status': 'Task assigned successfully'})

class TaskComments(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    @action(detail=True, methods=['get'], permission_classes=[IsTaskOwner | IsTeamLeader])
    def comments(self, request, pk=None):
        task = self.get_object()
        comments = task.comments.all()
        return Response(comments, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsTaskOwner | IsTeamLeader])
    def add_comment(self, request, pk=None):
        task = self.get_object()
        comment = request.data.get('comment', None)

        if not comment:
            return Response({'error': 'Yorum içeriği boş olamaz'}, status=status.HTTP_400_BAD_REQUEST)

        task.comments.create(user=request.user, content=comment)
        return Response({'status': 'Yorum başarıyla eklendi'}, status=status.HTTP_201_CREATED)

class TaskAttachments(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    @action(detail=True, methods=['get'], permission_classes=[IsTaskOwner | IsTeamLeader])
    def attachments(self, request, pk=None):
        task = self.get_object()
        attachments = task.attachments.all()
        return Response(attachments, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsTaskOwner | IsTeamLeader])
    def add_attachment(self, request, pk=None):
        task = self.get_object()
        attachment = request.FILES.get('attachment', None)

        if not attachment:
            return Response({'error': 'Dosya eklemek için bir dosya seçmelisiniz'}, status=status.HTTP_400_BAD_REQUEST)

        task.attachments.create(user=request.user, file=attachment)
        return Response({'status': 'Dosya başarıyla eklendi'}, status=status.HTTP_201_CREATED)

class TaskHistory(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    @action(detail=True, methods=['get'], permission_classes=[IsTaskOwner | IsTeamLeader])
    def history(self, request, pk=None):
        task = self.get_object()
        history = task.history.all()
        return Response(history, status=status.HTTP_200_OK)

class TaskStatusUpdate(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    @action(detail=True, methods=['patch'], permission_classes=[IsTaskOwner | IsTeamLeader])
    def update_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status', None)

        if not new_status:
            return Response({'error': 'Yeni durum değeri eksik'}, status=status.HTTP_400_BAD_REQUEST)

        task.status = new_status
        task.save()
        return Response({'status': 'Görev durumu başarıyla güncellendi'}, status=status.HTTP_200_OK)

class TeamMembers(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamManager | permissions.IsAdminUser, IsTeamLeaderOrAdmin]

    @action(detail=True, methods=['get'], permission_classes=[IsTeamManager | permissions.IsAdminUser, IsTeamLeaderOrAdmin])
    def members(self, request, pk=None):
        team = self.get_object()
        members = team.members.all()
        return Response(members, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsTeamManager | permissions.IsAdminUser, IsTeamLeaderOrAdmin])
    def add_member(self, request, pk=None, user_id=None):
        team = self.get_object()
        try:
            new_member = AppUser.objects.get(id=user_id)
        except AppUser.DoesNotExist:
            return Response({'error': 'Kullanıcı bulunamadı'}, status=status.HTTP_404_NOT_FOUND)

        role = request.data.get('role', None)
        if not role:
            return Response({'error': 'Rol değeri eksik'}, status=status.HTTP_400_BAD_REQUEST)

        team.memberships.create(user=new_member, role=role)
        return Response({'status': 'Üye başarıyla eklendi'}, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['delete'], permission_classes=[IsTeamManager | permissions.IsAdminUser, IsTeamLeaderOrAdmin])
    def remove_member(self, request, pk=None, user_id=None):
        team = self.get_object()
        try:
            member_to_remove = team.members.get(id=user_id)
        except AppUser.DoesNotExist:
            return Response({'error': 'Kullanıcı bulunamadı'}, status=status.HTTP_404_NOT_FOUND)

        team.memberships.filter(user=member_to_remove).delete()
        return Response({'status': 'Üye başarıyla kaldırıldı'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'], permission_classes=[IsTeamManager | permissions.IsAdminUser, IsTeamLeaderOrAdmin])
    def update_member_role(self, request, pk=None, user_id=None):
        team = self.get_object()
        try:
            member = team.members.get(id=user_id)
        except AppUser.DoesNotExist:
            return Response({'error': 'Kullanıcı bulunamadı'}, status=status.HTTP_404_NOT_FOUND)

        new_role = request.data.get('role', None)
        if not new_role:
            return Response({'error': 'Rol değeri eksik'}, status=status.HTTP_400_BAD_REQUEST)

        membership = team.memberships.filter(user=member).first()
        membership.role = new_role
        membership.save()
        return Response({'status': 'Üye rolü başarıyla güncellendi'}, status=status.HTTP_200_OK)

class MembershipRoleUpdate(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def update_role(self, request, pk=None):
        membership = self.get_object()
        new_role = request.data.get('role', None)

        if not new_role:
            return Response({'error': 'Rol değeri eksik'}, status=status.HTTP_400_BAD_REQUEST)

        membership.role = new_role
        membership.save()
        return Response({'status': 'Üyelik rolü başarıyla güncellendi'}, status=status.HTTP_200_OK)

class TaskFilterView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    def get_queryset(self):
        user = self.request.user
        order_by = self.request.query_params.get('order_by', None)
        team_id = self.request.query_params.get('team_id', None)

        task_viewset = BaseTaskViewSet()
        task_viewset.request = self.request
        return task_viewset.filter_and_order_tasks(order_by=order_by, team_id=team_id)


class TaskTeamFilterView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    def get_queryset(self):
        user = self.request.user
        team_id = self.kwargs['team_id']
        task_viewset = BaseTaskViewSet()
        task_viewset.request = self.request
        return task_viewset.filter_tasks_by_team(team_id)

class TaskCreateView(generics.CreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        team_id = self.request.data.get('team', None)
        if team_id:
            team = Team.objects.get(id=team_id)
            serializer.save(user=self.request.user, team=team)
        else:
            serializer.save(user=self.request.user)

class TaskUpdateView(generics.UpdateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(user=user)

class TaskRetrieveView(generics.RetrieveAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(user=user)

class TaskDeleteView(generics.DestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(user=user)

class TeamCreateView(generics.CreateAPIView):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        team = serializer.save()
        Membership.objects.create(user=user, team=team, role=Role.TEAM_LEADER.value)

class TeamUpdateView(generics.UpdateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamManager | permissions.IsAdminUser, IsTeamLeaderOrAdmin]

class TeamRetrieveView(generics.RetrieveAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamManager | permissions.IsAdminUser, IsTeamLeaderOrAdmin]

class TeamDeleteView(generics.DestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamManager | permissions.IsAdminUser, IsTeamLeaderOrAdmin]

class MembershipCreateView(generics.CreateAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def perform_create(self, serializer):
        team = serializer.validated_data['team']
        user = serializer.validated_data['user']
        role = serializer.validated_data['role']

        if Membership.objects.filter(user=user, team=team).exists():
            raise ValidationError("Bu kullanıcı zaten bu takımda yer alıyor.")

        serializer.save()

class BaseMembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

class UserTeamsAPIView(generics.ListAPIView):
    serializer_class = TeamSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        team_viewset = BaseTeamViewSet()
        team_viewset.request = self.request
        return team_viewset.get_user_teams(user)

class MembershipUpdateView(generics.UpdateAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

class MembershipRetrieveView(generics.RetrieveAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

class MembershipDeleteView(generics.DestroyAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def register_api_views(router):
        router.register(r'tasks', BaseTaskViewSet, basename='tasks')
        router.register(r'teams', BaseTeamViewSet, basename='teams')
        router.register(r'memberships', BaseMembershipViewSet, basename='memberships')
        router.add_api_view('user-teams', UserTeamsAPIView.as_view(), name='user-teams')