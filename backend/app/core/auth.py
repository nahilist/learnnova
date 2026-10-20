import hmac
import hashlib
import time
import logging
from typing import Optional
from fastapi import Request, HTTPException, Security
from fastapi.security import APIKeyHeader
from app.core.config import settings

logger = logging.getLogger(__name__)

user_id_header = APIKeyHeader(name="X-User-Id", auto_error=False)
signature_header = APIKeyHeader(name="X-Signature", auto_error=False)
timestamp_header = APIKeyHeader(name="X-Timestamp", auto_error=False)


def get_verified_user_id(
    request: Request,
    user_id: Optional[str] = Security(user_id_header),
    signature: Optional[str] = Security(signature_header),
    timestamp_str: Optional[str] = Security(timestamp_header),
) -> str:
    """
    Verifies that incoming requests originate from trusted Next.js server session.
    Enforces HMAC-SHA256 signature and timestamp freshness.
    """
    if not user_id:
        if settings.ENVIRONMENT == "development":
            return "dev-user"
        raise HTTPException(
            status_code=401,
            detail="Missing authentication credentials. User identity must be verified by session proxy.",
        )

    # In production, require signature and timestamp
    if settings.ENVIRONMENT == "production" or signature:
        if not signature or not timestamp_str:
            raise HTTPException(
                status_code=401,
                detail="Invalid request signature. Missing authentication headers.",
            )

        try:
            timestamp = int(timestamp_str)
            now = int(time.time())
            # 5-minute replay tolerance window
            if abs(now - timestamp) > 300:
                raise HTTPException(
                    status_code=401,
                    detail="Authentication signature expired.",
                )

            secret = settings.BACKEND_SECRET.encode("utf-8")
            payload = f"{user_id}:{timestamp}".encode("utf-8")
            expected_sig = hmac.new(secret, payload, hashlib.sha256).hexdigest()

            if not hmac.compare_digest(signature, expected_sig):
                logger.warning(f"HMAC verification failed for user_id={user_id}")
                raise HTTPException(
                    status_code=401,
                    detail="Invalid authentication signature.",
                )
        except ValueError:
            raise HTTPException(status_code=401, detail="Malformed timestamp header.")

    return user_id
