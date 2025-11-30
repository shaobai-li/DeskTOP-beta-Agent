from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Chat(Base):
    __tablename__ = "chats"

    chat_id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    selected_agent = Column(String, nullable=False)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

    # 关系
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "chatId": self.chat_id,
            "title": self.title,
            "selectedAgent": self.selected_agent,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at
        }

