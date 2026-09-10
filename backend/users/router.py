from fastapi import APIRouter, Depends, HTTPException, status, Request
from users.services import create_user, login_user
from users.schemas import UserBase, UserLogin
from db.config import SessionDep
from utils import create_tokens, revoke_refresh_token, verify_refresh_token, get_current_user
from fastapi.responses import JSONResponse
from decouple import config

router = APIRouter()

COOKIE_SECURE = config("FRONTEND_URL", default="http://localhost:5173").startswith("https://")


@router.post("/register")
async def register_user(session: SessionDep, user: UserBase):
    try:
        new_user = await create_user(session, user)
        return {"message": "User registered successfully", "user": new_user}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.post("/login")
async def login(session: SessionDep, user_login: UserLogin):
    user = await login_user(session, user_login)
    tokens = await create_tokens(session, user)
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=tokens["access_token"],
        httponly=True,
        samesite="lax",
        secure=COOKIE_SECURE,
        max_age=60 * 60 * 24 * 1,
    )
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        samesite="lax",
        secure=COOKIE_SECURE,
        max_age=60 * 60 * 24 * 7,
    )
    return response


@router.get("/refresh")
async def refresh_token(session: SessionDep, request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing"
        )

    user = await verify_refresh_token(session, refresh_token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Expired refresh token"
        )

    token = await create_tokens(session, user)
    response = JSONResponse(content={"message": "Token refreshed successfully"})
    response.set_cookie(
        key="access_token",
        value=token["access_token"],
        httponly=True,
        samesite="lax",
        secure=COOKIE_SECURE,
        max_age=60 * 60 * 24 * 1,
    )
    response.set_cookie(
        key="refresh_token",
        value=token["refresh_token"],
        httponly=True,
        samesite="lax",
        secure=COOKIE_SECURE,
        max_age=60 * 60 * 24 * 7,
    )
    return response


@router.post('/logout')
async def logout(session: SessionDep, request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        await revoke_refresh_token(session, refresh_token)
    response = JSONResponse(content={"message": "Logout"})
    response.delete_cookie(key='access_token')
    response.delete_cookie(key='refresh_token')
    return response


@router.get("/me")
async def current_user(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "user_name": current_user.user_name,
        "email": current_user.email,
    }