# backend.py
import os
import json
from pathlib import Path
from fastapi import FastAPI, File, UploadFile
from datetime import datetime

from api.v1 import agent_router, chat_router, article_router, message_router, tag_router

# 初始化
app = FastAPI()
UPLOAD_DIR = Path(__file__).parent / "database/uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
TEXT_METADATA_FILE = UPLOAD_DIR / "texts_metadata.json"

app.include_router(agent_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(article_router, prefix="/api/v1")
app.include_router(message_router, prefix="/api/v1")
app.include_router(tag_router, prefix="/api/v1")