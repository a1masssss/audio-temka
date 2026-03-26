"""Clerk webhook payload helpers and user sync."""

from __future__ import annotations

import logging
from typing import Any

from django.db import transaction

from users.models import User

logger = logging.getLogger(__name__)


def _primary_email(user_data: dict[str, Any]) -> str:
    addresses = user_data.get("email_addresses") or []
    primary_id = user_data.get("primary_email_address_id")
    for entry in addresses:
        if entry.get("id") == primary_id and entry.get("email_address"):
            return str(entry["email_address"]).strip()
    for entry in addresses:
        if entry.get("email_address"):
            return str(entry["email_address"]).strip()
    return ""


def handle_user_created(user_data: dict[str, Any]) -> User:
    clerk_id = user_data.get("id")
    if not clerk_id:
        raise ValueError("user.created: missing id")
    email = _primary_email(user_data)

    with transaction.atomic():
        # email may be missing on first user.created; model default is ""; user.updated fills email.
        defaults = {"email": email} if email else {}
        user, created = User.objects.update_or_create(
            clerk_id=clerk_id,
            defaults=defaults,
        )
    logger.info(
        "Clerk user %s: clerk_id=%s email=%r",
        "created" if created else "upserted",
        clerk_id,
        email or None,
    )
    return user


def handle_user_updated(user_data: dict[str, Any]) -> User:
    clerk_id = user_data.get("id")
    if not clerk_id:
        raise ValueError("user.updated: missing id")
    email = _primary_email(user_data)

    with transaction.atomic():
        # Do not overwrite an existing email with empty payload (Clerk sometimes omits addresses).
        defaults: dict[str, str] = {}
        if email:
            defaults["email"] = email
        user, created = User.objects.update_or_create(
            clerk_id=clerk_id,
            defaults=defaults,
        )
    logger.info(
        "Clerk user updated: clerk_id=%s email=%r (created=%s)",
        clerk_id,
        email or None,
        created,
    )
    return user


def handle_user_deleted(user_data: dict[str, Any]) -> None:
    clerk_id = user_data.get("id")
    if not clerk_id:
        raise ValueError("user.deleted: missing id")

    deleted, _ = User.objects.filter(clerk_id=clerk_id).delete()
    logger.info("Clerk user deleted: clerk_id=%s rows=%s", clerk_id, deleted)
