import os
import jwt
import base64
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

# Cache for JWKS
_jwks_cache = None


async def fetch_jwks():
    """Fetch JWKS from Supabase."""
    global _jwks_cache
    if _jwks_cache:
        return _jwks_cache
    
    supabase_url = os.environ.get("SUPABASE_URL", "")
    supabase_key = os.environ.get("SUPABASE_KEY", "")
    if not supabase_url:
        raise ValueError("SUPABASE_URL not configured")
    
    jwks_url = f"{supabase_url}/auth/v1/jwks"
    
    headers = {}
    if supabase_key:
        headers["apikey"] = supabase_key
        headers["Authorization"] = f"Bearer {supabase_key}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(jwks_url, headers=headers)
        response.raise_for_status()
        _jwks_cache = response.json()
        return _jwks_cache


def get_key_from_jwks(jwks, kid):
    """Get the public key from JWKS matching the key ID."""
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    return None


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


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    token = credentials.credentials
    
    try:
        # Get unverified header to check algorithm
        header = jwt.get_unverified_header(token)
        alg = header.get("alg")
        kid = header.get("kid")
        
        print(f"[Auth] Token algorithm: {alg}, key ID: {kid}")
        
        if alg == "HS256":
            # Symmetric - use JWT secret
            secret = get_jwt_secret()
            payload = jwt.decode(
                token, 
                secret, 
                algorithms=["HS256"], 
                audience="authenticated"
            )
        elif alg in ["RS256", "ES256"]:
            # Asymmetric - fetch public key from JWKS
            jwks = await fetch_jwks()
            key_data = get_key_from_jwks(jwks, kid)
            
            if not key_data:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Public key not found for kid: {kid}",
                )
            
            # Convert JWK to PEM format for PyJWT
            if alg == "RS256":
                from jwt.algorithms import RSAAlgorithm
                public_key = RSAAlgorithm.from_jwk(key_data)
            elif alg == "ES256":
                from jwt.algorithms import ECAlgorithm
                public_key = ECAlgorithm.from_jwk(key_data)
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Unsupported algorithm: {alg}",
                )
            
            payload = jwt.decode(
                token,
                public_key,  # type: ignore
                algorithms=[alg],
                audience="authenticated"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Unsupported algorithm: {alg}",
            )
        
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid auth credentials: no sub claim",
            )
        
        print(f"[Auth] Authenticated user: {user_id}")
        return user_id
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        print(f"[Auth] Invalid token error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        print(f"[Auth] Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
