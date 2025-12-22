"""Models module."""
from app.models.user import User
from app.models.link import Link, LinkStatus

__all__ = ["User", "Link", "LinkStatus"]
