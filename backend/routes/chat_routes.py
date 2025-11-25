import sqlite3
from config.settings import DB_DEV_PATH
from fastapi import APIRouter
from .utils import *
from pydantic import BaseModel
class ChatUpdate(BaseModel):
    title: str | None = None
    updated_at: str | None = None   # 如果你要更新这个字段

router = APIRouter()

@router.get("/chats")
def get_chats():
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
    if not DB_DEV_PATH.exists():
        return {"error": "数据库文件不存在"}
    conn = sqlite3.connect(DB_DEV_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    cur.execute("SELECT * FROM messages WHERE chat_id = ? ORDER BY message_id", (chat_id,))
    data = cur.fetchall()
    conn.close()
    return to_camel_case(data)

@router.patch("/chat/{chat_id}")
def update_chat(chat_id: str, update_data: ChatUpdate):
    if not DB_DEV_PATH.exists():
        return {"error": "数据库文件不存在"}
    conn = sqlite3.connect(DB_DEV_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()

    fields = []
    values = []

    if update_data.title is not None:
        fields.append("title = ?")
        values.append(update_data.title)

    if update_data.updated_at is not None:
        fields.append("updated_at = ?")
        values.append(update_data.updated_at)

    if not fields:
        return {"error": "没有可更新的字段"}

    values.append(chat_id)

    sql = f"UPDATE chats SET {', '.join(fields)} WHERE chat_id = ?"
    
    cur.execute(sql, tuple(values))
    conn.commit()

    if cur.rowcount == 0:
        conn.close()
        return {"error": "没有找到对应的 chat_id"}

    cur.execute("SELECT * FROM chats WHERE chat_id = ?", (chat_id,))
    updated_row = cur.fetchone()

    conn.close()
    return to_camel_case(updated_row)