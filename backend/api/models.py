# backend\api\models.py kodlarım
from django.db import models
from custom_user.models import AppUser, Role
from datetime import datetime
from django.db import models
from django.utils import timezone
from custom_user.models import AppUser

class Membership(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    team = models.ForeignKey('api.Team', on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=[(role.value, role.value) for role in Role], default=Role.TEAM_MEMBER.value)

    class Meta:
        unique_together = ('user', 'team')

class Team(models.Model):
    team_name = models.CharField(max_length=100, unique=True)
    team_manager = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='manager_teams')
    team_members = models.ManyToManyField(AppUser, through=Membership, related_name='member_teams')
    team_color = models.CharField(max_length=7)
    team_symbol = models.CharField(max_length=100)

    def evaluate_performance(self):
        tasks = Task.objects.filter(team=self)
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status='Tamamlanan').count()
        on_time_tasks = tasks.filter(status='Tamamlanan', due_date__gte=datetime.now()).count()

        if total_tasks > 0:
            completion_rate = (completed_tasks / total_tasks) * 100
            on_time_rate = (on_time_tasks / total_tasks) * 100
            return {
                "completion_rate": completion_rate,
                "on_time_rate": on_time_rate,
            }
        return None

    def __str__(self):
        return self.team_name
    
    def add_member(self, user, role=Role.TEAM_MEMBER.value):
        Membership.objects.create(user=user, team=self, role=role)

    def remove_member(self, user):
        membership = Membership.objects.filter(user=user, team=self)
        membership.delete()

    def set_leader(self, user):
        try:
            membership = Membership.objects.get(user=user, team=self)
            membership.role = Role.TEAM_LEADER.value
            membership.save()
        except Membership.DoesNotExist:
            raise ValueError(f"Kullanıcı {user} bu takımda bulunmamaktadır.")
    
    def calculate_project_duration(self):
        tasks = Task.objects.filter(team=self)
        start_date = None
        end_date = None

        for task in tasks:
            if start_date is None or task.start_date < start_date:
                start_date = task.start_date
            if end_date is None or task.due_date > end_date:
                end_date = task.due_date

        if start_date is not None and end_date is not None:
            project_duration = (end_date - start_date).days
            task_durations = [task.get_duration() for task in tasks]
            return {
                "project_duration": project_duration,
                "task_durations": task_durations,
            }
        return None

class Task(models.Model):
    STATUSES = (
        ('Planlanan', 'Planlanan'),
        ('Devam Eden', 'Devam Eden'),
        ('Tamamlanan', 'Tamamlanan'),
    )

    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUSES, default='todo')
    deadline = models.DateField(blank=True, null=True)
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    viewers = models.ManyToManyField(AppUser, related_name='viewed_tasks')  # Yeni eklenen viewers alanı
    team_members = models.ManyToManyField(AppUser, related_name="assigned_tasks")

    def calculate_duration(self):
        if self.start_date and self.due_date:
            duration = self.due_date - self.start_date
            return duration.days
        return 0

    def get_duration(self):
        return (self.due_date - self.start_date).days

    def update_status(self, new_status):
        self.status = new_status
        self.save()
    
    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']