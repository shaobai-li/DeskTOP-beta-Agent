# backend.py
import os
import json
from fastapi import FastAPI
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

@app.post("/generate")
def generate_content(query: UserQuery):
    """
    用户发送选题，后端返回生成的内容
    """
    topic = query.topic
    print(f"收到选题：{topic}")
    chunks = search_agent.local_search(topic, 4)
    ai_content = search_agent.content_framework(chunks)
    return {"topic": topic, "generated_content": ai_content}