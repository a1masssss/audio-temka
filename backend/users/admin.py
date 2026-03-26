from django.contrib import admin

from users.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "clerk_id", "created_at", "updated_at")
    search_fields = ("email", "clerk_id")
    readonly_fields = ("clerk_id", "created_at", "updated_at")
