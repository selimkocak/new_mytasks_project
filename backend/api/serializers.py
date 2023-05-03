#backend\api\serializers.py kodlarım
from rest_framework import serializers
from .models import Task, Team, Membership
from custom_user.models import AppUser
from custom_user.serializers import UserSerializer


class MembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Burada UserSerializer sınıfını kullanarak kullanıcı bilgilerini alıyoruz
    team = serializers.StringRelatedField()

    class Meta:
        model = Membership
        fields = ['user', 'team', 'role']



class TaskSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    username = serializers.StringRelatedField(source='user.first_name')

    class Meta:
        model = Task
        fields = ['id', 'user', 'username', 'title', 'description', 'status', 'deadline', 'team_membership', 'created_at', 'updated_at']

class TeamSerializer(serializers.ModelSerializer):
    team_manager = serializers.SlugRelatedField(slug_field='email', queryset=AppUser.objects.all())
    team_members = serializers.SlugRelatedField(slug_field='email', queryset=AppUser.objects.all(), many=True)

    class Meta:
        model = Team
        fields = ['id', 'team_name', 'team_manager', 'team_members', 'team_color', 'team_symbol']
