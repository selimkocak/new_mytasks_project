from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.exceptions import ValidationError
from api.models import Task, Team, Membership, AppUser
from api.serializers import TaskSerializer
from api.permissions import IsTaskOwner, IsTeamLeader
from api.permissions import Role

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]
 
    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = [permissions.IsAuthenticated]
        elif self.action in ["retrieve", "update", "destroy"]:
            self.permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        owned_tasks = Task.objects.filter(user=user)
        # Takıma bağlı görevlerin her takım üyesine görünür olması
        team_tasks = Task.objects.filter(team__members=user)
        return list(owned_tasks) + list(team_tasks)


    def assign_task_to_team_members(self, team_id, task):
        team_members = Membership.objects.filter(team_id=team_id)
        for member in team_members:
            task.team_members.add(member.user)  # 'team_members' kullanıyoruz

    def create(self, request, *args, **kwargs):
        user = request.user
        team_id = request.data.get('team', None)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if team_id:
            team = Team.objects.filter(id=team_id).first()

            if not team:
                raise ValidationError("Belirtilen takım bulunamadı.")

            membership = Membership.objects.filter(user=user, team=team).first()

            if not membership:
                raise ValidationError("Kullanıcı, belirtilen takımın üyesi değildir.")

            task = serializer.save(team=team)  # Takımı kaydedilen göreve ekleyin.
            
            # Takım üyelerine görevi atayalım.
            self.assign_task_to_team_members(team.id, task)
        else:
            task = serializer.save()  # Takımı olmayan görevi kaydedin.

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['patch'], permission_classes=[IsTaskOwner | IsTeamLeader])
    def update_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status', None)

        if not new_status:
            return Response({"detail": "Yeni durum değeri sağlanmalıdır."}, status=status.HTTP_400_BAD_REQUEST)

        task.update_status(new_status)
        serializer = self.get_serializer(task)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        user = self.request.user
        task = self.get_object()
        if not (self._is_task_owner(user, task) or self._is_team_leader(user, task)):
            raise ValidationError("Yalnızca görev sahibi veya takım lideri bu işlemi gerçekleştirebilir.")
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        team = self.get_object()
        if not self._is_team_leader_or_manager(request.user, team):
            return Response({"detail": "Yalnızca takım lideri veya yönetici bu işlemi gerçekleştirebilir."},
                            status=status.HTTP_403_FORBIDDEN)

        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = self.request.user
        task = self.get_object()

        if not (self._is_task_owner(user, task) or self._is_team_leader(user, task)):
            return Response({"detail": "Yalnızca görev sahibi veya takım lideri bu işlemi gerçekleştirebilir."},
                            status=status.HTTP_403_FORBIDDEN)

        return super().destroy(request, *args, **kwargs)

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

    def list(self, request, *args, **kwargs):
        team_id = request.query_params.get('team', None)
        order_by = request.query_params.get('order_by', None)
        
        queryset = self.filter_and_order_tasks(order_by, team_id)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], permission_classes=[IsTaskOwner | IsTeamLeader])
    def complete_task(self, request, pk=None):
        task = self.get_object()
        task.is_completed = True
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsTeamLeader])
    def assign_task_to_member(self, request, pk=None):
        task = self.get_object()
        user_email = request.data.get('user_email')

        if not user_email:
            return Response({"detail": "Kullanıcı e-posta adresi sağlanmalıdır."}, status=status.HTTP_400_BAD_REQUEST)

        user = AppUser.objects.filter(email=user_email).first()
        if not user:
            return Response({"detail": "Kullanıcı bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

        membership = Membership.objects.filter(user=user, team=task.team).first()
        if not membership:
            return Response({"detail": "Kullanıcı, görevin takımının üyesi değildir."}, status=status.HTTP_400_BAD_REQUEST)

        task.team_members.add(user)
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

