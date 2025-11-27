import sqlite3
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from config.settings import DB_DEV_PATH
from .utils import uuid7, to_camel_case, dict_factory


router = APIRouter()


class BeginChatRequest(BaseModel):
    topic: Optional[str] = None


def create_chat(title: str = None) -> str:
    """创建新的聊天记录，返回 chat_id"""
    if not DB_DEV_PATH.exists():
        raise HTTPException(status_code=500, detail="数据库文件不存在")
    
    conn = sqlite3.connect(DB_DEV_PATH)
    cur = conn.cursor()
    
    chat_id = uuid7()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # 如果没有提供标题，使用默认标题
    if title is None:
        title = "新对话"
    
    cur.execute(
        "INSERT INTO chats (chat_id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
        (chat_id, title, now, now)
    )
    conn.commit()
    conn.close()
    
    return chat_id


@router.post("/messages/begin")
def begin_chat(request: BeginChatRequest):
    """
    快速创建会话并返回 chatId
    这是一个快速 ACT 回复端点，便于前端立即获得 chatId
    """
    try:
        chat_id = create_chat(request.topic)
        
        # 查询创建的聊天记录
        conn = sqlite3.connect(DB_DEV_PATH)
        conn.row_factory = dict_factory
        cur = conn.cursor()
        cur.execute("SELECT * FROM chats WHERE chat_id = ?", (chat_id,))
        chat_data = cur.fetchone()
        conn.close()
        
        if chat_data:
            return to_camel_case(chat_data)
        else:
            return {
                "chatId": chat_id,
                "title": request.topic or "新对话"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"创建会话失败: {str(e)}")

