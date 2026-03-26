from __future__ import annotations

from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from users.clerk_jwt import verify_clerk_session_token
from users.models import User


class ClerkJWTAuthentication(BaseAuthentication):
    """
    Authorization: Bearer <Clerk session JWT>
    Maps `sub` to users.User via clerk_id (must exist after webhooks).
    """

    www_authenticate_realm = "Bearer"

    def authenticate(self, request):
        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return None

        token = auth[7:].strip()
        if not token:
            return None

        clerk_id = verify_clerk_session_token(token)
        if not clerk_id:
            raise AuthenticationFailed("Invalid or expired Clerk session token.")

        try:
            user = User.objects.get(clerk_id=clerk_id)
        except User.DoesNotExist as exc:
            raise AuthenticationFailed(
                "User is not registered in the app database yet. "
                "Sign in once so Clerk can sync, or retry shortly."
            ) from exc

        return (user, None)
