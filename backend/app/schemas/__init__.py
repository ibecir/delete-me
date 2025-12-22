"""Schemas module."""
from app.schemas.user import UserLogin, UserBase, UserCreate, UserResponse, UserWithLinks
from app.schemas.link import LinkBase, LinkCreate, LinkUpdate, LinkResponse, LinkListResponse
from app.schemas.dashboard import StatusBreakdown, DashboardStats

__all__ = [
    "UserLogin",
    "UserBase", 
    "UserCreate",
    "UserResponse",
    "UserWithLinks",
    "LinkBase",
    "LinkCreate",
    "LinkUpdate",
    "LinkResponse",
    "LinkListResponse",
    "StatusBreakdown",
    "DashboardStats"
]
