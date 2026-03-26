from django.contrib import admin

from main.models import AudioGeneration


@admin.register(AudioGeneration)
class AudioGenerationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "mime_type", "created_at")
    list_filter = ("mime_type", "created_at")
    search_fields = ("prompt", "user__clerk_id", "user__email")
    readonly_fields = ("user", "prompt", "mime_type", "created_at")
