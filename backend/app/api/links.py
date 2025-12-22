"""
Links API routes.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.database import get_db
from app.schemas.link import LinkCreate, LinkUpdate, LinkResponse, LinkListResponse
from app.services.link_service import LinkService
from app.services.user_service import UserService

router = APIRouter()


async def get_current_user_id(
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
    db: AsyncSession = Depends(get_db)
) -> int:
    """
    Simple authentication via header.
    In production, this would be replaced with proper JWT authentication.
    """
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
    
    # Verify user exists
    user_service = UserService(db)
    user = await user_service.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user_id


@router.get("", response_model=LinkListResponse)
async def get_all_links(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Get all links for the authenticated user."""
    link_service = LinkService(db)
    links = await link_service.get_all_by_user(user_id)
    
    return LinkListResponse(
        links=[LinkResponse.model_validate(link) for link in links],
        total=len(links)
    )


@router.get("/{link_id}", response_model=LinkResponse)
async def get_link(
    link_id: int,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific link by ID."""
    link_service = LinkService(db)
    link = await link_service.get_by_id(link_id, user_id)
    
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found"
        )
    
    return LinkResponse.model_validate(link)


@router.post("", response_model=LinkResponse, status_code=status.HTTP_201_CREATED)
async def create_link(
    link_data: LinkCreate,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Create a new link."""
    link_service = LinkService(db)
    link = await link_service.create(user_id, link_data)
    
    return LinkResponse.model_validate(link)


@router.put("/{link_id}", response_model=LinkResponse)
async def update_link(
    link_id: int,
    link_data: LinkUpdate,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Update an existing link."""
    link_service = LinkService(db)
    link = await link_service.update(link_id, user_id, link_data)
    
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found"
        )
    
    return LinkResponse.model_validate(link)


@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_link(
    link_id: int,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Delete a link."""
    link_service = LinkService(db)
    deleted = await link_service.delete(link_id, user_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found"
        )
    
    return None
