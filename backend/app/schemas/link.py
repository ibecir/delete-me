"""
Pydantic schemas for Link.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, HttpUrl, field_validator
from app.models.link import LinkStatus


class LinkBase(BaseModel):
    """Base link schema."""
    url: str
    title: Optional[str] = None
    
    @field_validator('url')
    @classmethod
    def validate_url(cls, v: str) -> str:
        """Validate URL format."""
        if not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        return v


class LinkCreate(LinkBase):
    """Schema for creating a new link."""
    pass


class LinkUpdate(BaseModel):
    """Schema for updating a link."""
    url: Optional[str] = None
    title: Optional[str] = None
    status: Optional[LinkStatus] = None
    
    @field_validator('url')
    @classmethod
    def validate_url(cls, v: Optional[str]) -> Optional[str]:
        """Validate URL format if provided."""
        if v is not None and not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        return v


class LinkResponse(BaseModel):
    """Schema for link response."""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_id: int
    url: str
    title: Optional[str]
    status: LinkStatus
    created_at: datetime
    updated_at: datetime


class LinkListResponse(BaseModel):
    """Schema for list of links response."""
    links: list[LinkResponse]
    total: int
