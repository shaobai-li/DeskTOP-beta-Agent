import json
import sqlite3
from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Dict, Optional
from agents import SearchAgent, TopicAnalysisAgent, DraftAgent
from config.settings import DB_DEV_PATH
from .utils import uuid7, to_camel_case, dict_factory


router = APIRouter()

# 初始化 agents
search_agent = SearchAgent()
topic_analysis_agent = TopicAnalysisAgent()
draft_agent = DraftAgent()


class UserQuery(BaseModel):
    topic: str
    chat_id: Optional[str] = None
    selected_agent: str


def create_chat(title: str, selected_agent: str) -> str:
    """创建新的聊天记录，返回 chat_id"""
    if not DB_DEV_PATH.exists():
        raise HTTPException(status_code=500, detail="数据库文件不存在")
    
    conn = sqlite3.connect(DB_DEV_PATH)
    cur = conn.cursor()
    
    chat_id = uuid7()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    cur.execute(
        "INSERT INTO chats (chat_id, title, selected_agent, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        (chat_id, title, selected_agent, now, now)
    )
    conn.commit()
    conn.close()
    
    return chat_id

def save_message(chat_id: str, content: str, role: str, journey_state: str):
    """保存消息到数据库"""
    if not DB_DEV_PATH.exists():
        raise Exception("数据库文件不存在")
    
    conn = sqlite3.connect(DB_DEV_PATH)
    cur = conn.cursor()
    
    message_id = uuid7()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    cur.execute(
        "INSERT INTO messages (message_id, chat_id, role, content, created_at, journey_state) VALUES (?, ?, ?, ?, ?, ?)",
        (message_id, chat_id, role, content, now, journey_state)
    )
    
    # 更新 chat 的 updated_at
    cur.execute(
        "UPDATE chats SET updated_at = ? WHERE chat_id = ?",
        (now, chat_id)
    )
    
    conn.commit()
    conn.close()
    return message_id

def get_journey_state(chat_id: str) -> str:
    if not DB_DEV_PATH.exists():
        raise Exception("数据库文件不存在")
    
    conn = sqlite3.connect(DB_DEV_PATH)
    cur = conn.cursor()
    cur.execute("SELECT journey_state FROM messages WHERE chat_id = ? ORDER BY created_at DESC LIMIT 1", (chat_id,))
    journey_state = cur.fetchone()[0]
    conn.close()
    return journey_state


@router.post("/messages/begin")
def begin_chat(request: UserQuery):
    """
    快速创建会话并返回 chatId
    这是一个快速 ACT 回复端点，便于前端立即获得 chatId
    """
    try:
        chat_id = create_chat(request.topic, request.selected_agent)   
        message_id = save_message(chat_id, journey_state="0", content=request.topic, role="user")

        return {
            "chatId": chat_id,
            "messageId": message_id,
            "title": request.topic or "新对话",
            "selectedAgent": request.selected_agent
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"创建会话失败: {str(e)}")


@router.post("/messages/stream")
def generate_content(query: UserQuery):
    """处理聊天消息生成请求"""
    topic = query.topic
    chat_id = query.chat_id
    selected_agent = query.selected_agent
    journey_state = get_journey_state(chat_id)

    def generate_and_save(journey_state):
        if journey_state == "0":
            chunks = search_agent.local_search(topic, 4)
            chunk_str = json.dumps({
                "stage": 1,
                "topic": topic,
                "generated_content": chunks
            }) + "\n"
            yield chunk_str
            
            save_message(chat_id, journey_state=journey_state, content=chunks, role="assistant")

            status_msg = "正在构思的选题列表"
            yield json.dumps({
                "stage": 2,
                "topic": topic,
                "generated_content": status_msg
            }) + "\n"

            topic_list = search_agent.content_framework(chunks)
            status_msg2 = "正在分析选题列表"
            yield json.dumps({
                "stage": 3,
                "topic": topic,
                "generated_content": status_msg2
            }) + "\n"

            for xml_topic in topic_analysis_agent.analyze_topic_list(topic_list):
                chunk_str = json.dumps({
                    "stage": 4,
                    "topic": topic,
                    "generated_content": xml_topic
                }) + "\n"
                yield chunk_str
            
            journey_state = "1"
            save_message(chat_id, journey_state=journey_state, content=str(xml_topic), role="assistant")
        elif journey_state == "1":
            generated_draft = draft_agent.draft(topic)
            chunk_str = json.dumps({
                "stage": 5,
                "topic": topic,
                "generated_content": generated_draft
            }) + "\n"
            yield chunk_str
            journey_state = "0"
            save_message(chat_id, journey_state=journey_state, content=generated_draft, role="assistant")

        else:
            raise ValueError("Invalid journey")
        
    
    return StreamingResponse(
        generate_and_save(journey_state),
        media_type="application/json"
    )

