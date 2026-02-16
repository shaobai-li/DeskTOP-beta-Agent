from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .base import Base


class Message(Base):
    __tablename__ = "messages"

    message_id = Column(String, primary_key=True)
    chat_id = Column(String, ForeignKey("chats.chat_id"), nullable=False)
    role = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(String, nullable=False)
    journey_state = Column(String, nullable=False)
    meta_data = Column(JSON, nullable=True, default=None)

    # 关系
    chat = relationship("Chat", back_populates="messages")

    def to_dict(self):
        return {
            "messageId": self.message_id,
            "chatId": self.chat_id,
            "role": self.role,
            "content": self.content,
            "createdAt": self.created_at,
            "journeyState": self.journey_state,
            "metadata": self.meta_data  # 前端仍然使用 metadata 字段名
        }

