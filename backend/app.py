# backend.py
import os
import json
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

from pydantic import BaseModel
from agents import SearchAgent

# 初始化
app = FastAPI()
search_agent = SearchAgent()

# 定义请求体
class UserQuery(BaseModel):
    topic: str

@app.get("/")
def root():
    return {"message": "AI 内容创作助手已启动"}



def generate_process(topic: str):
    # 第一次返回搜索结果（中间结果）
    chunks = search_agent.local_search(topic, 4)
    yield json.dumps({
        "stage": 1,
        "topic": topic,
        "generated_content": chunks
    }) + "\n"

    # 第二次返回生成结果（最终结果）
    ai_content = search_agent.content_framework(chunks)
    yield json.dumps({
        "stage": 2,
        "topic": topic,
        "generated_content": ai_content
    }) + "\n"

@app.post("/generate")
def generate_content(query: UserQuery):
    topic = query.topic
    return StreamingResponse(
        generate_process(topic),
        media_type="application/json"
    )