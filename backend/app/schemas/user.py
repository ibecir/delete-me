"""
Pydantic schemas for User.
"""
from datetime import datetime
from typing import TYPE_CHECKING, List
from pydantic import BaseModel, EmailStr, ConfigDict

if TYPE_CHECKING:
    from app.schemas.link import LinkResponse


class UserLogin(BaseModel):
    """Schema for user login request."""
    email: EmailStr


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr


class UserCreate(UserBase):
    """Schema for creating a new user."""
    pass


class UserResponse(UserBase):
    """Schema for user response."""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime


class UserWithLinks(UserResponse):
    """Schema for user with their links."""
    links: List["LinkResponse"] = []


# Handle forward reference
from app.schemas.link import LinkResponse  # noqa: E402, F811
UserWithLinks.model_rebuild()
