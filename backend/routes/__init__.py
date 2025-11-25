from .chat_routes import router as chat_router
from .article_routes import router as article_router
from .agent_routes import router as agent_router
from .tag_routes import router as tag_router

__all__ = [
    "chat_router",
    "article_router",
    "agent_router",
    "tag_router",
]