# backend.py
import os
import json
import sqlite3
from pathlib import Path
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from datetime import datetime
from pydantic import BaseModel
from agents import SearchAgent, TopicAnalysisAgent, DraftAgent
from typing import Dict, Optional

from routes import chat_router, article_router, agent_router, tag_router, messages_router
from routes.utils import uuid7, dict_factory
from config.settings import DB_DEV_PATH
# 初始化
app = FastAPI()
search_agent = SearchAgent()
topic_analysis_agent = TopicAnalysisAgent()
draft_agent = DraftAgent()
UPLOAD_DIR = Path(__file__).parent / "database/uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
TEXT_METADATA_FILE = UPLOAD_DIR / "texts_metadata.json"

app.include_router(chat_router, prefix="/api")
app.include_router(article_router, prefix="/api")
app.include_router(agent_router, prefix="/api")
app.include_router(tag_router, prefix="/api")
app.include_router(messages_router, prefix="/api")

# 定义请求体
class UserQuery(BaseModel):
    topic: str
    chat_id: Optional[str] = None
    agent_id: Optional[str] = None


STATE_STORE: Dict[str, int] = {}



def get_state(chat_id: str):
    return STATE_STORE.get(chat_id, 0)

def set_state(chat_id: str, state: int):
    STATE_STORE[chat_id] = state

@app.post("/generate")
def generate_content(query: UserQuery):
    """处理聊天消息生成请求"""
    topic = query.topic
    chat_id = query.chat_id
 

    def generate_and_save():
        ai_reply_parts = []
        state = get_state(chat_id)
        
        if state == 0:
            chunks = search_agent.local_search(topic, 4)
            chunk_str = json.dumps({
                "stage": 1,
                "topic": topic,
                "generated_content": chunks
            }) + "\n"
            ai_reply_parts.append(str(chunks))
            yield chunk_str

            status_msg = "正在构思的选题列表"
            yield json.dumps({
                "stage": 2,
                "topic": topic,
                "generated_content": status_msg
            }) + "\n"
            ai_reply_parts.append(status_msg)

            topic_list = search_agent.content_framework(chunks)
            status_msg2 = "正在分析选题列表"
            yield json.dumps({
                "stage": 3,
                "topic": topic,
                "generated_content": status_msg2
            }) + "\n"
            ai_reply_parts.append(status_msg2)

            for xml_topic in topic_analysis_agent.analyze_topic_list(topic_list):
                chunk_str = json.dumps({
                    "stage": 4,
                    "topic": topic,
                    "generated_content": xml_topic
                }) + "\n"
                ai_reply_parts.append(str(xml_topic))
                yield chunk_str
            set_state(chat_id, 1)
        elif state == 1:
            generated_draft = draft_agent.draft(topic)
            chunk_str = json.dumps({
                "stage": 5,
                "topic": topic,
                "generated_content": generated_draft
            }) + "\n"
            ai_reply_parts.append(str(generated_draft))
            yield chunk_str
            set_state(chat_id, 0)
        else:
            raise ValueError("Invalid journey")
        
        # 所有块发送完毕后，保存完整的 AI 回复
        ai_reply = "\n".join(ai_reply_parts)
        save_message(chat_id, ai_reply, "assistant")
    
    return StreamingResponse(
        generate_and_save(),
        media_type="application/json"
    )

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as f:
        f.write(await file.read())

    file_info = {
        "title": file.filename.split(".")[0],
        "date": datetime.now().strftime("%Y-%m-%d"),
        "status": "已导入"
    }

    if TEXT_METADATA_FILE.exists():
        with open(TEXT_METADATA_FILE, "r", encoding="utf-8") as f:
            records = json.load(f)
    else:
        records = []
    records.append(file_info)
    with open(TEXT_METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    return {
        "message": "文件上传成功",
        "filename": file.filename,
    }