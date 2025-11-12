import sqlite3
from pathlib import Path
from fastapi import APIRouter

router = APIRouter()

DB_PATH = Path(__file__).resolve().parent.parent / "database" / "chatbot.db"

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
    if not DB_PATH.exists():
        return {"error": "数据库文件不存在，请先生成 chatbot.db"}
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    cur.execute("SELECT * FROM chats ORDER BY updated_at DESC")
    data = cur.fetchall()
    conn.close()
    return to_camel_case(data)

@router.get("/chat/{chat_id}/messages")
def get_chat_messages(chat_id: str):
    """获取指定会话的所有消息"""
    if not DB_PATH.exists():
        return {"error": "数据库文件不存在，请先生成 chatbot.db"}
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    cur.execute("SELECT * FROM messages WHERE chat_id = ? ORDER BY message_id", (chat_id,))
    data = cur.fetchall()
    conn.close()
    return to_camel_case(data)