from datetime import datetime, timedelta, timezone
import uuid
from fastapi import HTTPException, Request, status
from jose import jwt, ExpiredSignatureError, JWTError
from passlib.context import CryptContext
from decouple import config
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.config import SessionDep
from db.models import Users, RefreshTokens

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


SECRET_KEY = config("SECRET_KEY")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )


async def create_tokens(session: AsyncSession, user: Users):
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token_str = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)

    refresh_token = RefreshTokens(
        user_id = user.id, refresh_token=refresh_token_str, expires_at=expires_at
    )
    session.add(refresh_token)
    await session.commit()
    return {"access_token": access_token, "refresh_token": refresh_token_str}

async def get_current_user(session: SessionDep, request: Request):
    token = request.cookies.get('access_token')
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token is missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id  = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid User",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid User",
            headers={"WWW-Authenticate": "Bearer"},
        )

    stmt = select(Users).where(Users.id == user_id)
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def verify_refresh_token(session: AsyncSession, token: str):
    stmt = select(RefreshTokens).where(RefreshTokens.refresh_token == token)
    result = await session.scalars(stmt)
    db_refresh_token = result.first()
    if db_refresh_token and not db_refresh_token.revoked:
        expires_at = db_refresh_token.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at > datetime.now(timezone.utc):
            user_stmt = select(Users).where(Users.id == db_refresh_token.user_id)
            user_result = await session.scalars(user_stmt)
            return user_result.first()
    return None


async def revoke_refresh_token(session: AsyncSession, token: str):
    stmt = select(RefreshTokens).where(RefreshTokens.refresh_token == token)
    result = await session.scalars(stmt)
    db_refresh_token = result.first()
    if db_refresh_token:
        db_refresh_token.revoked = True
        session.add(db_refresh_token)
        await session.commit()
