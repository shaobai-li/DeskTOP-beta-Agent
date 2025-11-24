import sqlite3
from pathlib import Path
from tarfile import data_filter
from config.settings import DB_DEV_PATH, JSON_DEV_AGENTS_PATH, JSON_DEV_TAGS_PATH
import json
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

def dict_factory(cursor, row):
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}

def to_camel_case(data):
    def convert_key(key):
        parts = key.split('_')
        return parts[0] + ''.join(word.capitalize() for word in parts[1:])
    return [{convert_key(k): v for k, v in item.items()} for item in data]

def to_snake_case(data):
    def convert_key(key):
        result = []
        for i, char in enumerate(key):
            if char.isupper() and i > 0:
                result.append('_')
            result.append(char.lower())
        return ''.join(result)
    return {convert_key(k): v for k, v in data.items()}

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


@router.get("/agents")
def get_agents():
    """读取所有知能体数据"""
    if not JSON_DEV_AGENTS_PATH.exists():
        return {"error": "知能体数据文件不存在"}

    with open(JSON_DEV_AGENTS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    data_agents = data.get("agents", [])
    return to_camel_case(data_agents)

@router.patch("/agents/{agent_id}")
def update_agent(agent_id: str, update_data: dict):
    """部分更新知能体数据（只更新提供的字段）"""
    if not JSON_DEV_AGENTS_PATH.exists():
        return {"error": "知能体数据文件不存在"}

    with open(JSON_DEV_AGENTS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    agents = data.get("agents", [])
    target_agent = next((a for a in agents if a.get("agent_id") == agent_id), None)

    if not target_agent:
        return {"error": f"知能体 {agent_id} 不存在"}

    for key, value in to_snake_case(update_data).items():
        target_agent[key] = value

    data["agents"] = agents
    with open(JSON_DEV_AGENTS_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    return {"message": "更新成功", "agent": target_agent}

@router.get("/tags")
def get_tags():
    if not JSON_DEV_TAGS_PATH.exists():
        return {"error": "标签数据文件不存在"}
    
    with open(JSON_DEV_TAGS_PATH, "r", encoding="utf-8") as f:
        data= json.load(f)

    data_tags = data.get("tags", [])
    return to_camel_case(data_tags)