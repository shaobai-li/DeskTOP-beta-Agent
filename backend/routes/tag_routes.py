import json
from fastapi import APIRouter
from config.settings import JSON_DEV_TAGS_PATH
from .utils import *

router = APIRouter()

@router.get("/tags")
def get_tags():
    if not JSON_DEV_TAGS_PATH.exists():
        return {"error": "标签数据文件不存在"}

    with open(JSON_DEV_TAGS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    return to_camel_case(data.get("tags", []))
