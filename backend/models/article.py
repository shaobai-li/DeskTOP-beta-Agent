from sqlalchemy import Column, String, Integer, Table, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

# 关联表
article_tags = Table(
    "article_tags",
    Base.metadata,
    Column("article_id", String, ForeignKey("articles.article_id"), primary_key=True),
    Column("tag_id", String, ForeignKey("tags.tag_id"), primary_key=True)
)


class Article(Base):
    __tablename__ = "articles"

    article_id = Column(String, primary_key=True)
    title = Column(String, nullable=False, unique=True)
    date = Column(String, nullable=False)
    source_platform = Column(String, nullable=False, server_default="小红书")
    author_name = Column(String, server_default="")
    tags_by_author = Column(String, server_default="")
    content = Column(String, server_default="")
    embedding_id = Column(Integer, nullable=True)  # 向量索引ID，与 faiss index 顺序对应
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

    # 关系
    tags = relationship("Tag", secondary=article_tags, back_populates="articles")

    def to_dict(self):
        return {
            "articleId": self.article_id,
            "title": self.title,
            "date": self.date,
            "sourcePlatform": self.source_platform,
            "authorName": self.author_name,
            "tagsByAuthor": self.tags_by_author,
            "content": self.content,
            "embeddingId": self.embedding_id,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at
        }

