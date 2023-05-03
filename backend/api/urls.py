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
    path('custom_user/teams/', views.TeamViewSet.as_view({'get': 'list'}), name='user-teams'),
] + task_router.urls + team_router.urls