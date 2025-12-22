"""
Dashboard API routes.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.database import get_db
from app.schemas.dashboard import DashboardStats, StatusBreakdown
from app.schemas.link import LinkResponse
from app.services.link_service import LinkService
from app.services.user_service import UserService

router = APIRouter()


async def get_current_user_id(
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
    db: AsyncSession = Depends(get_db)
) -> int:
    """Get current user ID from header."""
    if not x_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="X-User-ID header is required"
        )
    
    try:
        user_id = int(x_user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )
    
    return user_id


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Get dashboard statistics for the authenticated user."""
    user_service = UserService(db)
    link_service = LinkService(db)
    
    # Verify user exists
    user = await user_service.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Get statistics
    total_links = await link_service.get_count_by_user(user_id)
    status_breakdown = await link_service.get_status_breakdown(user_id)
    recent_links = await link_service.get_recent_links(user_id, limit=5)
    
    return DashboardStats(
        total_links=total_links,
        status_breakdown=StatusBreakdown(**status_breakdown),
        recent_links=[LinkResponse.model_validate(link) for link in recent_links],
        member_since=user.created_at
    )
