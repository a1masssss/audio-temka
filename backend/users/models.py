from django.db import models


class User(models.Model):
    """Application user synced from Clerk (webhooks)."""

    clerk_id = models.CharField(max_length=255, unique=True, db_index=True)
    # Clerk may send user.created before email_addresses is populated; filled on user.updated.
    email = models.EmailField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users_user"
        ordering = ["-created_at"]

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def is_anonymous(self) -> bool:
        return False

    def __str__(self) -> str:
        return f"{self.email or self.clerk_id} ({self.clerk_id})"
