# backend.py
import os
import json
from pathlib import Path
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from datetime import datetime
from pydantic import BaseModel
from agents import SearchAgent, TopicAnalysisAgent

from routes.chat_routes import router as chat_router

# 初始化
app = FastAPI()
search_agent = SearchAgent()
topic_analysis_agent = TopicAnalysisAgent()
UPLOAD_DIR = Path(__file__).parent / "database/uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
TEXT_METADATA_FILE = UPLOAD_DIR / "texts_metadata.json"

app.include_router(chat_router, prefix="/api")

# 定义请求体
class UserQuery(BaseModel):
    topic: str


def generate_process(topic: str):

    chunks = search_agent.local_search(topic, 4)
    yield json.dumps({
        "stage": 1,
        "topic": topic,
        "generated_content": chunks
    }) + "\n"

    yield json.dumps({
        "stage": 2,
        "topic": topic,
        "generated_content": "正在构思的选题列表"
    }) + "\n"

    topic_list = search_agent.content_framework(chunks)
    yield json.dumps({
        "stage": 3,
        "topic": topic,
        "generated_content": "正在分析选题列表"
    }) + "\n"

    for xml_topic in topic_analysis_agent.analyze_topic_list(topic_list):
        yield json.dumps({
            "stage": 4,
            "topic": topic,
            "generated_content": xml_topic
        }) + "\n"


@app.post("/generate")
def generate_content(query: UserQuery):
    topic = query.topic
    return StreamingResponse(
        generate_process(topic),
        media_type="application/json"
    )

# @app.get("/rows")
# def rows():
#     text = TEXT_METADATA_FILE.read_text(encoding="utf-8")
#     data = json.loads(text)
#     return data


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