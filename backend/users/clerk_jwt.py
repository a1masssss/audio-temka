"""Verify Clerk session JWTs (RS256) using JWKS."""

from __future__ import annotations

import logging
from functools import lru_cache

import jwt
from django.conf import settings
from jwt import PyJWKClient

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def _jwks_client() -> PyJWKClient | None:
    url = getattr(settings, "CLERK_JWKS_URL", None) or ""
    if not url.strip():
        return None
    return PyJWKClient(url.strip())


def verify_clerk_session_token(token: str) -> str | None:
    """
    Return Clerk user id (`sub`) if the JWT is valid, else None.
    """
    client = _jwks_client()
    if client is None:
        logger.warning("CLERK_JWKS_URL is not set; cannot verify Clerk JWTs")
        return None

    try:
        signing_key = client.get_signing_key_from_jwt(token)
        issuer = (getattr(settings, "CLERK_JWT_ISSUER", None) or "").strip()
        kw: dict = {
            "algorithms": ["RS256"],
            "options": {"verify_aud": False},
        }
        if issuer:
            kw["issuer"] = issuer

        payload = jwt.decode(token, signing_key.key, **kw)
        sub = payload.get("sub")
        return str(sub) if sub else None
    except jwt.ExpiredSignatureError:
        logger.info("Clerk JWT expired")
        return None
    except jwt.InvalidTokenError as exc:
        logger.info("Clerk JWT invalid: %s", exc)
        return None
    except Exception as exc:
        logger.exception("Clerk JWT verification error: %s", exc)
        return None
