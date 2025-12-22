"""
Link service for business logic.
"""
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.models.link import Link, LinkStatus
from app.schemas.link import LinkCreate, LinkUpdate


class LinkService:
    """Service class for link operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_all_by_user(self, user_id: int) -> list[Link]:
        """Get all links for a user."""
        query = (
            select(Link)
            .where(Link.user_id == user_id)
            .order_by(Link.created_at.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_by_id(self, link_id: int, user_id: int) -> Optional[Link]:
        """Get a specific link by ID (scoped to user)."""
        query = (
            select(Link)
            .where(Link.id == link_id, Link.user_id == user_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def create(self, user_id: int, link_data: LinkCreate) -> Link:
        """Create a new link."""
        link = Link(
            user_id=user_id,
            url=link_data.url,
            title=link_data.title,
            status=LinkStatus.PENDING.value
        )
        self.db.add(link)
        await self.db.commit()
        await self.db.refresh(link)
        return link
    
    async def update(self, link_id: int, user_id: int, link_data: LinkUpdate) -> Optional[Link]:
        """Update an existing link."""
        link = await self.get_by_id(link_id, user_id)
        if not link:
            return None
        
        update_data = link_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(link, field, value)
        
        link.updated_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(link)
        return link
    
    async def delete(self, link_id: int, user_id: int) -> bool:
        """Delete a link."""
        link = await self.get_by_id(link_id, user_id)
        if not link:
            return False
        
        await self.db.delete(link)
        await self.db.commit()
        return True
    
    async def get_count_by_user(self, user_id: int) -> int:
        """Get total link count for a user."""
        query = select(func.count(Link.id)).where(Link.user_id == user_id)
        result = await self.db.execute(query)
        return result.scalar() or 0
    
    async def get_status_breakdown(self, user_id: int) -> dict[str, int]:
        """Get link count by status for a user."""
        query = (
            select(Link.status, func.count(Link.id))
            .where(Link.user_id == user_id)
            .group_by(Link.status)
        )
        result = await self.db.execute(query)
        
        breakdown = {
            "pending": 0,
            "processing": 0,
            "completed": 0
        }
        
        for status, count in result.all():
            breakdown[status] = count
        
        return breakdown
    
    async def get_recent_links(self, user_id: int, limit: int = 5) -> list[Link]:
        """Get most recent links for a user."""
        query = (
            select(Link)
            .where(Link.user_id == user_id)
            .order_by(Link.created_at.desc())
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())
