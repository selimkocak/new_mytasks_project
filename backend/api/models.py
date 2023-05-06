# backend\api\models.py kodlarım
from django.db import models
from custom_user.models import AppUser, Role

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
    
    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']