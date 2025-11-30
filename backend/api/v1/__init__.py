# API v1 module
from .agent_routes import router as agent_router
from .chat_routes import router as chat_router
from .article_routes import router as article_router
from .message_routes import router as message_router
from .tag_routes import router as tag_router

__all__ = [
    "agent_router",
    "chat_router",
    "article_router",
    "message_router",
    "tag_router",
]
