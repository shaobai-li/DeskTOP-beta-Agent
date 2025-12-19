from sqlalchemy import Column, String, Text, Table, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base
from utils import uuid7

# 关联表 - agents 和 tags 的多对多关系
agent_tags = Table(
    "agent_tags",
    Base.metadata,
    Column("agent_id", String, ForeignKey("agents.agent_id"), primary_key=True),
    Column("tag_id", String, ForeignKey("tags.tag_id"), primary_key=True)
)


class Agent(Base):
    """知能体数据模型"""
    __tablename__ = "agents"
    
    agent_id = Column(String, primary_key=True, default=uuid7)
    title = Column(String, nullable=False, default="未命名智能体")
    persona_prompt = Column(Text, nullable=True, default="")
    usp_prompt = Column(Text, nullable=True, default="")
    default_prompt_dir = Column(String, nullable=True, default="agents/prompts/")
    vector_index = Column(Text, nullable=True)  # 新增的向量索引列
    
    # 关系
    tags = relationship("Tag", secondary=agent_tags, back_populates="agents")
    
    def to_dict(self):
        return {
            "agent_id": self.agent_id,
            "title": self.title,
            "persona_prompt": self.persona_prompt,
            "usp_prompt": self.usp_prompt,
            "default_prompt_dir": self.default_prompt_dir,
            "vector_index": self.vector_index  # 添加到字典方法中
        }
