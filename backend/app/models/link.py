"""
Link database model.
"""
from datetime import datetime
from sqlalchemy import String, DateTime, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
import enum

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class LinkStatus(str, enum.Enum):
    """Enum for link processing status."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"


class Link(Base):
    """Link model for storing user links."""
    
    __tablename__ = "links"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, 
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    url: Mapped[str] = mapped_column(Text, nullable=False)
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(
        String(20),
        default=LinkStatus.PENDING.value,
        nullable=False,
        index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )
    
    # Relationship to user
    user: Mapped["User"] = relationship("User", back_populates="links")
    
    def __repr__(self) -> str:
        return f"<Link(id={self.id}, url='{self.url[:50]}...', status='{self.status}')>"
