"""
Pydantic schemas for Dashboard.
"""
from datetime import datetime
from pydantic import BaseModel
from app.schemas.link import LinkResponse


class StatusBreakdown(BaseModel):
    """Schema for status breakdown."""
    pending: int
    processing: int
    completed: int


class DashboardStats(BaseModel):
    """Schema for dashboard statistics."""
    total_links: int
    status_breakdown: StatusBreakdown
    recent_links: list[LinkResponse]
    member_since: datetime
