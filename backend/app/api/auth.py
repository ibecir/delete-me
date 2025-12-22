"""
Authentication API routes.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.user import UserLogin, UserWithLinks
from app.schemas.link import LinkResponse
from app.services.user_service import UserService

router = APIRouter()


@router.post("/login", response_model=UserWithLinks)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user by email.
    
    - If email exists: returns user data with their links
    - If email doesn't exist: returns 404 error
    """
    user_service = UserService(db)
    user = await user_service.get_by_email(credentials.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Please check your email or contact support."
        )
    
    # Convert links to response format
    links_response = [LinkResponse.model_validate(link) for link in user.links]
    
    return UserWithLinks(
        id=user.id,
        email=user.email,
        created_at=user.created_at,
        links=links_response
    )


@router.post("/register", response_model=UserWithLinks, status_code=status.HTTP_201_CREATED)
async def register(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user by email.
    
    - If email already exists: returns 409 conflict error
    - If email is new: creates user and returns user data
    """
    user_service = UserService(db)
    
    # Check if user already exists
    existing_user = await user_service.get_by_email(credentials.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists."
        )
    
    # Create new user
    user = await user_service.create(credentials.email)
    
    return UserWithLinks(
        id=user.id,
        email=user.email,
        created_at=user.created_at,
        links=[]
    )
