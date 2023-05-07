#backend\api\urls.py kodlarım
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, TeamViewSet, MembershipViewSet, UserTeamsAPIView

task_router = DefaultRouter()
task_router.register(r'tasks', TaskViewSet, basename='tasks')
team_router = DefaultRouter()
team_router.register(r'teams', TeamViewSet, basename='teams')
membership_router = DefaultRouter()
membership_router.register(r'memberships', MembershipViewSet, basename='memberships')

urlpatterns = [
    path('custom_user/tasks/', TaskViewSet.as_view({'get': 'list'}), name='user-tasks'),
    path('custom_user/teams/', UserTeamsAPIView.as_view(), name='user-teams'),
    path('tasks/<int:pk>/update_status/', TaskViewSet.as_view({'patch': 'update_status'}), name='task-update-status'),
    path('teams/<int:pk>/project_duration/', TeamViewSet.as_view({'get': 'project_duration'}), name='team-project-duration'),
    path('teams/<int:pk>/evaluate_performance/', TeamViewSet.as_view({'get': 'evaluate_performance'}), name='team-evaluate-performance'),
] + task_router.urls + team_router.urls + membership_router.urls
