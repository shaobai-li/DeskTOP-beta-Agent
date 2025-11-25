import sqlite3
from config.settings import DB_DEV_PATH, JSON_DEV_AGENTS_PATH, JSON_DEV_TAGS_PATH
import json
from fastapi import APIRouter
from .utils import *

router = APIRouter()

@router.get("/chats")
def get_chats():
    """获取所有会话列表"""
    if not DB_DEV_PATH.exists():
        return {"error": "数据库文件不存在"}
    conn = sqlite3.connect(DB_DEV_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    cur.execute("SELECT * FROM chats ORDER BY updated_at DESC")
    data = cur.fetchall()
    conn.close()
    return to_camel_case(data)

@router.get("/chat/{chat_id}/messages")
def get_chat_messages(chat_id: str):
    """获取指定会话的所有消息"""
    if not DB_DEV_PATH.exists():
        return {"error": "数据库文件不存在"}
    conn = sqlite3.connect(DB_DEV_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    cur.execute("SELECT * FROM messages WHERE chat_id = ? ORDER BY message_id", (chat_id,))
    data = cur.fetchall()
    conn.close()
    return to_camel_case(data)