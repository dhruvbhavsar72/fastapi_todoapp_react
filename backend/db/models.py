from datetime import datetime , timezone

from db.base import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey , DateTime
from sqlalchemy.orm import relationship

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer,primary_key=True,index=True)
    first_name = Column(String(200),nullable=False)
    last_name = Column(String(200),nullable=False)
    email = Column(String(100),unique=True,nullable=False)
    user_name = Column(String(50) , unique=True, nullable=False)
    password = Column(String(200))
    is_active = Column(Boolean , default=True)
    phone_no = Column(String(25))

    refresh_tokens = relationship("RefreshTokens", back_populates="user", cascade="all, delete-orphan")


class Todos(Base):
    __tablename__ = 'todo'

    id = Column(Integer,primary_key=True,index=True)
    user_id = Column(Integer , ForeignKey("users.id"))
    title = Column(String(200))
    description = Column(String)
    is_complete = Column(Boolean , default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))



class RefreshTokens(Base):
    __tablename__ = 'refresh_tokens'

    id = Column(Integer,primary_key=True,index=True)
    user_id = Column(Integer , ForeignKey("users.id"))
    refresh_token = Column(String(500))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked = Column(Boolean, default=False)

    user = relationship("Users", back_populates="refresh_tokens")
