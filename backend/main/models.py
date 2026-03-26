from django.db import models


class AudioGeneration(models.Model):
    """One successful generate-audio request for analytics / history."""

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="audio_generations",
    )
    prompt = models.TextField()
    mime_type = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "main_audiogeneration"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user.clerk_id} @ {self.created_at}"
