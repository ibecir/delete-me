"""
User service for business logic.
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional

from app.models.user import User


class UserService:
    """Service class for user operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email with their links."""
        query = (
            select(User)
            .options(selectinload(User.links))
            .where(User.email == email)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        query = (
            select(User)
            .options(selectinload(User.links))
            .where(User.id == user_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def create(self, email: str) -> User:
        """Create a new user."""
        user = User(email=email)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def exists(self, email: str) -> bool:
        """Check if user exists by email."""
        query = select(User.id).where(User.email == email)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None
