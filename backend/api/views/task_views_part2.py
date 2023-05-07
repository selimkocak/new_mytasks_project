# backend\api\views\task_views_part2.py kodlarım
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from api.models import Membership, AppUser
from api.serializers import TaskSerializer
from api.permissions import IsTaskOwner, IsTeamLeader

class TaskViewSetPart2(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner | IsTeamLeader]

    def destroy(self, request, *args, **kwargs):
        user = self.request.user
        task = self.get_object()

        if not (self._is_task_owner(user, task) or self._is_team_leader(user, task)):
            return Response({"detail": "Yalnızca görev sahibi veya takım lideri bu işlemi gerçekleştirebilir."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

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