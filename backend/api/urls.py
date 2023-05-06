#backend\api\urls.py kodlarım
from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

task_router = DefaultRouter()
task_router.register(r'tasks', views.TaskViewSet, basename='tasks')
team_router = DefaultRouter()
team_router.register(r'teams', views.TeamViewSet, basename='teams')
urlpatterns = [
    path('custom_user/tasks/', views.TaskViewSet.as_view({'get': 'list'}), name='user-tasks'),
    path('custom_user/teams/', views.UserTeamsAPIView.as_view(), name='user-teams'),
    path('tasks/<int:pk>/update_status/', views.TaskViewSet.as_view({'patch': 'update_status'}), name='task-update-status'),
    path('teams/<int:pk>/project_duration/', views.TeamViewSet.as_view({'get': 'project_duration'}), name='team-project-duration'),
    path('teams/<int:pk>/evaluate_performance/', views.TeamViewSet.as_view({'get': 'evaluate_performance'}), name='team-evaluate-performance'),
] + task_router.urls + team_router.urls
