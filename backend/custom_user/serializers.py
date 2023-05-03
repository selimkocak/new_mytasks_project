#backend\custom_user\serializers.py kodlarım
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import AppUser, Role

class UserSerializer(serializers.ModelSerializer):
    # role = serializers.ChoiceField(choices=[(role.value, role.value) for role in Role])  # Bu satırı silin

    class Meta:
        model = AppUser
        fields = ('id', 'email', 'first_name', 'last_name')  # 'role' alanını da kaldırın



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    role = serializers.ChoiceField(choices=[(role.value, role.value) for role in Role], required=False, default=Role.TEAM_MEMBER.value)

    class Meta:
        model = AppUser
        fields = ('email', 'password', 'first_name', 'last_name', 'role')
        extra_kwargs = {'first_name': {'required': False}, 'last_name': {'required': False}}

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        user = AppUser.objects.create_user(
            email=email,
            password=password,
            **validated_data,
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect email or password.")