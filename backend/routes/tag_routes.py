import json
from fastapi import APIRouter, HTTPException, status
from config.settings import JSON_DEV_TAGS_PATH
from .utils import *
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

router = APIRouter()

class TagCreate(BaseModel):
    name: str
    description: str = ""          
    origin_note: str = ""

class TagUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    origin_note: str | None = None

@router.get("/tags")
def get_tags():
    if not JSON_DEV_TAGS_PATH.exists():
        return {"error": "标签数据文件不存在"}

    with open(JSON_DEV_TAGS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    return to_camel_case(data.get("tags", []))

@router.post("/tags", status_code=status.HTTP_201_CREATED)
def create_tag(tag: TagCreate):        
    if not JSON_DEV_TAGS_PATH.exists():
        raise HTTPException(status_code=500, detail="标签文件不存在")

    try:
        with open(JSON_DEV_TAGS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        data = {"tags": []}

    tags = data.get("tags", [])

    if any(t["name"].lower() == tag.name.strip().lower() for t in tags):
        raise HTTPException(status_code=400, detail="标签名已存在")

    new_tag = {
        "tag_id": uuid7(),
        "name": tag.name.strip(),
        "description": tag.description.strip(),
        "origin_note": tag.origin_note.strip(),
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    tags.append(new_tag)
    data["tags"] = tags

    tmp = JSON_DEV_TAGS_PATH.with_suffix(".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    tmp.replace(JSON_DEV_TAGS_PATH)

    return to_camel_case([new_tag])[0]

@router.put("/tags/{tag_id}", status_code=status.HTTP_200_OK)
async def update_tag(tag_id: str, update_data: TagUpdate):
    """
    更新指定 tag_id 的标签
    - 支持部分更新（只传想改的字段就行）
    - tag_id 必须是像 "tag_01" 这样的格式
    """
    if not JSON_DEV_TAGS_PATH.exists():
        raise HTTPException(status_code=404, detail="标签文件不存在")

    with open(JSON_DEV_TAGS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    tags: List[Dict[str, Any]] = data.get("tags", [])

    
    target_tag = None
    for tag in tags:
        if tag["tag_id"] == tag_id:
            target_tag = tag
            break

    if not target_tag:
        raise HTTPException(status_code=404, detail=f"标签 {tag_id} 不存在")

    
    if update_data.name is not None:
            new_name = update_data.name.strip()
            # 名字重复检查
            if new_name.lower() != target_tag["name"].lower():
                if any(t["name"].lower() == new_name.lower() and t["tag_id"] != tag_id for t in tags):
                    raise HTTPException(status_code=400, detail="标签名已存在")
            target_tag["name"] = new_name

    if update_data.description is not None:
        target_tag["description"] = update_data.description.strip()

    if update_data.origin_note is not None:
        target_tag["origin_note"] = update_data.origin_note.strip()

    
    tmp = JSON_DEV_TAGS_PATH.with_suffix(".tmp")
    try:
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        tmp.replace(JSON_DEV_TAGS_PATH)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"保存失败: {str(e)}")

    return to_camel_case([target_tag])[0]

@router.delete("/tags/{tag_id}", status_code=status.HTTP_200_OK)
def delete_tag(tag_id: str):
    """
    删除指定 tag_id 的标签
    返回被删除的标签信息（便于前端提示）
    """
    if not JSON_DEV_TAGS_PATH.exists():
        raise HTTPException(status_code=404, detail="标签文件不存在")

    try:
        with open(JSON_DEV_TAGS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        raise HTTPException(status_code=500, detail="读取标签文件失败")

    tags: List[Dict[str, Any]] = data.get("tags", [])

    # 查找要删除的标签
    target_tag = None
    target_index = -1
    for i, tag in enumerate(tags):
        if tag["tag_id"] == tag_id:
            target_tag = tag
            target_index = i
            break

    if target_tag is None:
        raise HTTPException(status_code=404, detail=f"标签 {tag_id} 不存在")

    
    deleted_tag = tags.pop(target_index)
    data["tags"] = tags

    # 原子写文件
    tmp = JSON_DEV_TAGS_PATH.with_suffix(".tmp")
    try:
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        tmp.replace(JSON_DEV_TAGS_PATH)
    except Exception as e:
        
        raise HTTPException(status_code=500, detail=f"删除失败，保存文件时出错: {str(e)}")

    
    return to_camel_case([deleted_tag])[0]