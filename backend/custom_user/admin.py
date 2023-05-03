#backend\custom_user\admin.py kodlarım
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import AppUser
from api.models import Membership  # Membership modelini api uygulamasından içe aktar

class MembershipInline(admin.TabularInline):  # MembershipInline sınıfını oluşturun
    model = Membership
    extra = 0

class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'last_login')
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    search_fields = ('email', 'first_name', 'last_name')
    readonly_fields = ('last_login',)
    inlines = (MembershipInline,)  # MembershipInline'ı ekleyin
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
    )
    ordering = ('email',)

admin.site.register(AppUser, CustomUserAdmin)
