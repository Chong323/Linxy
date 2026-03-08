import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    token = credentials.credentials
    
    # Allow dev bypass for local testing only
    env = os.environ.get("ENV", "production")
    if env == "development":
        # Try to decode real token first, fallback to dev-user if it fails
        try:
            secret = os.environ.get("SUPABASE_JWT_SECRET", "")
            if secret:
                payload = jwt.decode(
                    token, secret, algorithms=["HS256"], audience="authenticated"
                )
                user_id = payload.get("sub")
                if user_id:
                    return user_id
        except:
            pass
        # Fallback to extracting user from token or use dev-user
        return "dev-user-123"
    
    secret = os.environ.get("SUPABASE_JWT_SECRET", "")
    if not secret:
        raise ValueError("Supabase JWT secret not found.")
    try:
        payload = jwt.decode(
            token, secret, algorithms=["HS256"], audience="authenticated"
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid auth credentials",
            )
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
