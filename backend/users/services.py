from users.schemas import TodosBase, UserBase, UserLogin
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from utils import hash_password , verify_password
from db.models import Users, Todos


async def create_user(session: AsyncSession, user: UserBase):
    userPresent = select(Users).where(Users.email == user.email)
    result = await session.execute(userPresent)
    existing_user = result.first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already registered",
        )

    check_username = select(Users).where(Users.user_name == user.user_name)
    usernamePresent  = await session.execute(check_username)
    result_username = usernamePresent.first()
    if result_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already other user has this username, please choose another one",
        )

    new_user = Users(
        first_name=user.first_name,
        last_name = user.last_name,
        email = user.email,
        user_name = user.user_name,
        password = hash_password(user.password),
        is_active = user.is_active,
        phone_no = user.phone_no
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)


async def login_user(session:AsyncSession,user_login:UserLogin):
    getUser = select(Users).where(Users.user_name == user_login.user_name)
    result = await session.execute(getUser)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    if not verify_password(user_login.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
        )
    return user
    

