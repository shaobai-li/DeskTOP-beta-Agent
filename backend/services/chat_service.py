from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Optional
from datetime import datetime
from models.chat import Chat
from utils import to_camel_case


class ChatService:
    """聊天业务逻辑服务层"""

    @staticmethod
    async def get_all_chats(db: AsyncSession) -> List[Dict]:
        """获取所有聊天记录"""
        result = await db.execute(
            select(Chat).order_by(Chat.updated_at.desc())
        )
        chats = result.scalars().all()
        return to_camel_case([chat.to_dict() for chat in chats])

    @staticmethod
    async def update_chat(chat_id: str, title: Optional[str] = None, 
                          updated_at: Optional[str] = None, db: AsyncSession = None) -> Dict:
        """更新聊天记录"""
        chat = await db.get(Chat, chat_id)
        if not chat:
            raise ValueError(f"没有找到对应的 chat_id: {chat_id}")

        if title is not None:
            chat.title = title

        if updated_at is not None:
            chat.updated_at = updated_at
        elif title is not None:
            # 如果更新了 title，自动更新 updated_at
            chat.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if title is None and updated_at is None:
            raise ValueError("没有可更新的字段")

        await db.commit()
        await db.refresh(chat)
        return to_camel_case([chat.to_dict()])[0]

    @staticmethod
    async def delete_chat(chat_id: str, db: AsyncSession = None) -> Dict:
        """删除指定的聊天记录及其相关消息"""
        chat = await db.get(Chat, chat_id)
        if not chat:
            raise ValueError(f"聊天记录 {chat_id} 不存在")
        
        chat_dict = chat.to_dict()
        # 由于设置了 cascade="all, delete-orphan"，删除 chat 会自动删除关联的 messages
        await db.delete(chat)
        await db.commit()
        
        return to_camel_case([chat_dict])[0]

