import json
from datetime import datetime
from typing import Optional, AsyncGenerator, List, Dict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from models.chat import Chat
from models.message import Message
from utils import uuid7, to_camel_case
from agents import SearchAgent, TopicAnalysisAgent, DraftAgent


class MessageService:
    """消息业务逻辑服务层"""

    def __init__(self):
        self.search_agent = SearchAgent()
        self.topic_analysis_agent = TopicAnalysisAgent()
        self.draft_agent = DraftAgent()

    @staticmethod
    async def create_chat(title: str, selected_agent: str, db: AsyncSession) -> str:
        """创建新的聊天记录，返回 chat_id"""
        chat_id = uuid7()
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        new_chat = Chat(
            chat_id=chat_id,
            title=title,
            selected_agent=selected_agent,
            created_at=now,
            updated_at=now
        )
        db.add(new_chat)
        await db.commit()
        await db.refresh(new_chat)
        
        return chat_id

    @staticmethod
    async def save_message(chat_id: str, content: str, role: str, journey_state: str, db: AsyncSession) -> str:
        """保存消息到数据库"""
        message_id = uuid7()
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        new_message = Message(
            message_id=message_id,
            chat_id=chat_id,
            role=role,
            content=content,
            created_at=now,
            journey_state=journey_state
        )
        db.add(new_message)
        
        # 更新 chat 的 updated_at
        chat = await db.get(Chat, chat_id)
        if chat:
            chat.updated_at = now
        
        await db.commit()
        await db.refresh(new_message)
        
        return message_id

    @staticmethod
    async def get_chat_messages(chat_id: str, db: AsyncSession) -> List[Dict]:
        """获取指定聊天的所有消息"""
        result = await db.execute(
            select(Message)
            .where(Message.chat_id == chat_id)
            .order_by(Message.message_id)
        )
        messages = result.scalars().all()
        return to_camel_case([message.to_dict() for message in messages])

    @staticmethod
    async def get_journey_state(chat_id: str, db: AsyncSession) -> str:
        """获取聊天的当前 journey_state"""
        result = await db.execute(
            select(Message.journey_state)
            .where(Message.chat_id == chat_id)
            .order_by(Message.created_at.desc())
            .limit(1)
        )
        journey_state = result.scalar_one_or_none()
        return journey_state if journey_state else "0"  # 默认状态

    async def begin_chat(self, topic: str, selected_agent: str, db: AsyncSession) -> dict:
        """快速创建会话并返回 chatId"""
        chat_id = await MessageService.create_chat(topic, selected_agent, db)
        message_id = await MessageService.save_message(chat_id, journey_state="0", content=topic, role="user", db=db)

        return {
            "chatId": chat_id,
            "messageId": message_id,
            "title": topic or "新对话",
            "selectedAgent": selected_agent
        }

    async def generate_content(self, topic: str, chat_id: str, selected_agent: str, db: AsyncSession) -> AsyncGenerator[str, None]:
        """处理聊天消息生成请求"""
        journey_state = await MessageService.get_journey_state(chat_id, db)

        if journey_state == "0":
            chunks = self.search_agent.local_search(topic, 4)
            chunk_str = json.dumps({
                "stage": 1,
                "topic": topic,
                "generated_content": chunks
            }) + "\n"
            yield chunk_str
            
            await MessageService.save_message(chat_id, journey_state=journey_state, content=chunks, role="assistant", db=db)

            status_msg = "正在构思的选题列表"
            yield json.dumps({
                "stage": 2,
                "topic": topic,
                "generated_content": status_msg
            }) + "\n"

            topic_list = self.search_agent.content_framework(chunks)
            status_msg2 = "正在分析选题列表"
            yield json.dumps({
                "stage": 3,
                "topic": topic,
                "generated_content": status_msg2
            }) + "\n"

            xml_topic = None
            for xml_topic in self.topic_analysis_agent.analyze_topic_list(topic_list):
                chunk_str = json.dumps({
                    "stage": 4,
                    "topic": topic,
                    "generated_content": xml_topic
                }) + "\n"
                yield chunk_str
                
                if xml_topic:
                    await MessageService.save_message(chat_id, journey_state=journey_state, content=str(xml_topic), role="assistant", db=db)
            
            journey_state = "1"
            
        elif journey_state == "1":
            generated_draft = self.draft_agent.draft(topic)
            chunk_str = json.dumps({
                "stage": 5,
                "topic": topic,
                "generated_content": generated_draft
            }) + "\n"
            yield chunk_str
            journey_state = "0"
            await MessageService.save_message(chat_id, journey_state=journey_state, content=generated_draft, role="assistant", db=db)
        else:
            raise ValueError("Invalid journey state")

