# backend.py
import os
import json
from pathlib import Path
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from datetime import datetime
from pydantic import BaseModel
from agents import SearchAgent

# 初始化
app = FastAPI()
search_agent = SearchAgent()
UPLOAD_DIR = Path(__file__).parent / "database/uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
TEXT_METADATA_FILE = UPLOAD_DIR / "texts_metadata.json"

# 定义请求体
class UserQuery(BaseModel):
    topic: str

@app.get("/")
def root():
    return {"message": "AI 内容创作助手已启动"}


def generate_process(topic: str):

    chunks = search_agent.local_search(topic, 4)
    yield json.dumps({
        "stage": 1,
        "topic": topic,
        "generated_content": chunks
    }) + "\n"

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

@app.get("/rows")
def rows():
    text = TEXT_METADATA_FILE.read_text(encoding="utf-8")
    data = json.loads(text)
    return data


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