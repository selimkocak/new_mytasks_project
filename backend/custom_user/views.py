#backend\custom_user\views.py kodlarım
from django.contrib.auth import login, logout
from rest_framework import generics, permissions, response, status
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from .models import AppUser, Role
from rest_framework import viewsets
from api.permissions import IsAdminUser
from rest_framework.response import Response

class UserListView(generics.ListAPIView):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny] # Allow any user to register

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return response.Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "Kullanıcı başarıyla kaydedildi.",
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)
        return response.Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "Kullanıcı başarıyla oturum açtı.",
        }, status=status.HTTP_200_OK)

class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logout(request)
        return response.Response({"message": "Kullanıcı başarıyla oturum kapattı."},
                                 status=status.HTTP_204_NO_CONTENT)
    
class AppUserViewSet(viewsets.ModelViewSet):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

