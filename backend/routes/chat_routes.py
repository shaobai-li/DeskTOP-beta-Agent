import sqlite3
from pathlib import Path
from config.settings import DB_DEV_PATH, JSON_DEV_AGENTS_PATH
import json
from fastapi import APIRouter

router = APIRouter()

def dict_factory(cursor, row):
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}

def to_camel_case(data):
    def convert_key(key):
        parts = key.split('_')
        return parts[0] + ''.join(word.capitalize() for word in parts[1:])
    return [{convert_key(k): v for k, v in item.items()} for item in data]

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

@router.get("/articles")
def get_articles():
    """读取所有文章数据"""
    if not DB_DEV_PATH.exists():
        return {"error": "数据库文件不存在"}

    conn = sqlite3.connect(DB_DEV_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM articles
        ORDER BY article_id ASC
    """)

    data = cur.fetchall()
    conn.close()

    return to_camel_case(data)


@router.get("/articles")
def get_agents():
    """读取所有知能体数据"""
    if not JSON_DEV_AGENTS_PATH.exists():
        return {"error": "知能体数据文件不存在"}

    with open(JSON_DEV_AGENTS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    return to_camel_case(data)