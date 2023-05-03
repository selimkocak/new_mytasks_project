from django.contrib import admin
from .models import Task, Team, Membership  # Membership modelini içe aktarın

class MembershipInline(admin.TabularInline):  # MembershipInline sınıfını oluşturun
    model = Membership
    extra = 0

class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'status', 'deadline', 'team_membership', 'created_at', 'updated_at')
    list_filter = ('status', 'user', 'team_membership')
    search_fields = ('title', 'user__email', 'team_membership__team_name')  # user ve team_membership ile ilişkili alanları arama yapmak için ekleyin
    readonly_fields = ('created_at', 'updated_at')

class TeamAdmin(admin.ModelAdmin):
    list_display = ('id', 'team_name', 'team_manager', 'team_color', 'team_symbol')
    inlines = (MembershipInline,)  # MembershipInline'ı ekleyin
    search_fields = ('team_name', 'team_manager__email')  # team_manager ile ilişkili alanları arama yapmak için ekleyin

admin.site.register(Task, TaskAdmin)
admin.site.register(Team, TeamAdmin)
