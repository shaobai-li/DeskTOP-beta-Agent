# backend.py
import os
import json
from pathlib import Path
from fastapi import FastAPI, File, UploadFile
from datetime import datetime

from routes import chat_router, article_router, agent_router, tag_router, messages_router

# 初始化
app = FastAPI()
UPLOAD_DIR = Path(__file__).parent / "database/uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
TEXT_METADATA_FILE = UPLOAD_DIR / "texts_metadata.json"

app.include_router(chat_router, prefix="/api")
app.include_router(article_router, prefix="/api")
app.include_router(agent_router, prefix="/api")
app.include_router(tag_router, prefix="/api")
app.include_router(messages_router, prefix="/api")

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