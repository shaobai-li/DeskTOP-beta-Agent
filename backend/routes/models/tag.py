from sqlalchemy import Column, String, text
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class Tag(Base):
    __tablename__ = "tags"

    tag_id = Column(String, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, server_default="")
    origin_note = Column(String, server_default="")
    created_at = Column(String, nullable=False)

    def to_dict(self):
        return {
            "tagId": self.tag_id,
            "name": self.name,
            "description": self.description,
            "originNote": self.origin_note,
            "createdAt": self.created_at
        }