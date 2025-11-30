from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from .base import Base

class Tag(Base):
    __tablename__ = "tags"

    tag_id = Column(String, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, server_default="")
    origin_note = Column(String, server_default="")
    created_at = Column(String, nullable=False)

    # 关系
    articles = relationship("Article", secondary="article_tags", back_populates="tags")

    def to_dict(self):
        return {
            "tagId": self.tag_id,
            "name": self.name,
            "description": self.description,
            "originNote": self.origin_note,
            "createdAt": self.created_at
        }

