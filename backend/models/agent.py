from sqlalchemy import Column, String, Text
from .base import Base
from utils import uuid7


class Agent(Base):
    """知能体数据模型"""
    __tablename__ = "agents"
    
    agent_id = Column(String(36), primary_key=True, default=uuid7)
    title = Column(String(100), nullable=False, default="未命名智能体")
    persona_prompt = Column(Text, nullable=True, default="")
    language_style_prompt = Column(Text, nullable=True, default="")
    default_prompt_dir = Column(String(255), nullable=True, default="agents/prompts/")
    
    def to_dict(self):
        return {
            "agent_id": self.agent_id,
            "title": self.title,
            "persona_prompt": self.persona_prompt,
            "language_style_prompt": self.language_style_prompt,
            "default_prompt_dir": self.default_prompt_dir
        }
