import os
import jwt
import base64
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()


def get_jwt_secret() -> str | bytes:
    """Get JWT secret, decoding from base64 if necessary."""
    secret = os.environ.get("SUPABASE_JWT_SECRET", "")
    if not secret:
        raise ValueError("SUPABASE_JWT_SECRET not found in environment.")
    
    # Try to decode as base64 first (Supabase stores it base64 encoded)
    try:
        # Add padding if needed
        padded = secret + '=' * (4 - len(secret) % 4) if len(secret) % 4 else secret
        decoded = base64.b64decode(padded)
        return decoded
    except:
        # If not base64, use as-is
        return secret


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    token = credentials.credentials
    
    try:
        secret = get_jwt_secret()
        payload = jwt.decode(
            token, secret, algorithms=["HS256"], audience="authenticated"
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid auth credentials: no sub claim",
            )
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
