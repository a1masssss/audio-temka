import logging
import os

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from svix.exceptions import WebhookVerificationError
from svix.webhooks import Webhook

from users.services import (
    handle_user_created,
    handle_user_deleted,
    handle_user_updated,
)

logger = logging.getLogger(__name__)


def _svix_headers(request: Request) -> dict[str, str]:
    return {
        "svix-id": request.headers.get("svix-id", ""),
        "svix-timestamp": request.headers.get("svix-timestamp", ""),
        "svix-signature": request.headers.get("svix-signature", ""),
    }


@method_decorator(csrf_exempt, name="dispatch")
class ClerkWebhookView(APIView):
    """
    Clerk → Svix-signed webhooks. Use raw body for signature verification.
    """

    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = []

    def post(self, request: Request) -> Response:
        secret = os.getenv("CLERK_WEBHOOK_SECRET")
        if not secret:
            logger.error("CLERK_WEBHOOK_SECRET is not set")
            return Response(
                {"detail": "Webhook secret not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            wh = Webhook(secret)
            payload = wh.verify(request.body, _svix_headers(request))
        except WebhookVerificationError as exc:
            logger.warning("Clerk webhook signature failed: %s", exc)
            return Response(
                {"detail": "Invalid signature."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as exc:
            logger.exception("Clerk webhook verify error: %s", exc)
            return Response(
                {"detail": "Verification failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            event_type = payload.get("type")
            data = payload.get("data") or {}

            if event_type == "user.created":
                handle_user_created(data)
            elif event_type == "user.updated":
                handle_user_updated(data)
            elif event_type == "user.deleted":
                handle_user_deleted(data)
            else:
                logger.debug("Clerk webhook ignored type=%s", event_type)

            return Response({"received": True}, status=status.HTTP_200_OK)
        except ValueError as exc:
            logger.warning("Clerk webhook handler: %s", exc)
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            logger.exception("Clerk webhook handler error: %s", exc)
            return Response(
                {"detail": "Internal error processing webhook."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
