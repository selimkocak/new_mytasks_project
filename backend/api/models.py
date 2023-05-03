#backend\api\models.py kodlarım
from django.db import models
from custom_user.models import AppUser, Role  # Role'i buraya ekle

class Membership(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    team = models.ForeignKey('api.Team', on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=[(role.value, role.value) for role in Role], default=Role.TEAM_MEMBER.value)

    class Meta:
        unique_together = ('user', 'team')

class Team(models.Model):
    team_name = models.CharField(max_length=100, unique=True)
    team_manager = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='manager_teams')
    team_members = models.ManyToManyField(AppUser, through=Membership, related_name='member_teams')  # Membership'i doğrudan referans verin
    team_color = models.CharField(max_length=7)
    team_symbol = models.CharField(max_length=100)

    def __str__(self):
        return self.team_name

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
    team_membership = models.ForeignKey(Team, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']