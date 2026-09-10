import re
from pydantic import BaseModel, EmailStr, Field, field_validator

class UserBase(BaseModel):
    first_name: str = Field(..., example="John")
    last_name: str = Field(..., example="Doe")
    email: EmailStr = Field(..., example="john.doe@example.com")
    user_name: str = Field(..., example="johndoe")
    password: str = Field(..., example="Password@123", min_length=8, max_length=16)
    is_active : bool = True
    phone_no: str = Field(..., example="1234567890")

    @field_validator('password')
    @classmethod
    def check_password(cls, value):
        return validate_password(value)
    

    @field_validator('email')
    @classmethod
    def validate_email(cls, value):
        if not re.fullmatch(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", value):
            raise ValueError('Invalid email address')
        return value



def validate_password(value):
    if len(value) < 8 or len(value) > 16:
        raise ValueError('Password must be between 8 and 16 characters long')
    if not any(char.isdigit() for char in value):
        raise ValueError('Password must contain at least one digit')
    if not any(char.isupper() for char in value):
        raise ValueError('Password must contain at least one uppercase letter')
    if not any(char in "!@#$%^&*(),.?\":{}|<>" for char in value):
        raise ValueError('Password must contain at least one special character')
    return value

class TodosBase(BaseModel):
    title: str = Field(..., example="Buy groceries")
    description: str = Field(..., example="Milk, Bread, Eggs")
    is_complete: bool = False


class UserLogin(BaseModel):
    user_name: str = Field(..., example="johndoe")
    password: str = Field(..., example="Password@123", min_length=8, max_length=16)
    @field_validator('password')
    @classmethod
    def check_password(cls, value):
        return validate_password(value)