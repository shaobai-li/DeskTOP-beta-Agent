from sqlalchemy import select, text
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .utils import *
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from models.tag import Tag
from database import get_db
from typing import Optional

router = APIRouter()

class TagCreate(BaseModel):
    name: str = Field(..., description="标签名称")
    description: str = Field("", description="标签描述")
    origin_note: str = Field("", description="来源备注")

class TagUpdate(BaseModel):
    name: Optional[str] = Field(None, description="新标签名（可选）")
    description: Optional[str] = Field(None, description="新描述（可选）")
    origin_note: Optional[str] = Field(None, description="新来源备注（可选）")

@router.get("/tags", response_model=List[dict])
async def get_tags(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tag).order_by(Tag.created_at.desc()))
    tags = result.scalars().all()
    return to_camel_case([tag.to_dict() for tag in tags])
   

@router.post("/tags", status_code=status.HTTP_201_CREATED, response_model=dict)
async def create_tag(tag_in: TagCreate, db: AsyncSession = Depends(get_db)):
    name = tag_in.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="标签名不能为空")

    # 检查重复（不区分大小写）
    result = await db.execute(
        select(Tag).where(Tag.name.ilike(name))
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="标签名已存在")

    new_tag = Tag(
        tag_id=uuid7(),
        name=name,
        description=tag_in.description.strip(),
        origin_note=tag_in.origin_note.strip(),
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(new_tag)
    await db.commit()
    await db.refresh(new_tag)
    return to_camel_case([new_tag.to_dict()])[0]

@router.put("tags/{tag_id}", response_model=dict)
async def update_tag(tag_id: str, tag_in: TagUpdate, db: AsyncSession = Depends(get_db)):
    tag = await db.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail=f"标签 {tag_id} 不存在")

    # 直接判断每个字段是否传入（不为 None）
    if tag_in.name is not None:
        new_name = tag_in.name.strip()
        if not new_name:
            raise HTTPException(status_code=400, detail="标签名不能为空")
        if new_name.lower() != tag.name.lower():
            result = await db.execute(
                select(Tag).where(Tag.name.ilike(new_name), Tag.tag_id != tag_id)
            )
            if result.scalar_one_or_none():
                raise HTTPException(status_code=400, detail="标签名已存在")
        tag.name = new_name

    if tag_in.description is not None:
        tag.description = tag_in.description.strip()

    if tag_in.origin_note is not None:
        tag.origin_note = tag_in.origin_note.strip()

    await db.commit()
    await db.refresh(tag)
    return to_camel_case([tag.to_dict()])[0]

@router.delete("tags/{tag_id}", response_model=dict)
async def delete_tag(tag_id: str, db: AsyncSession = Depends(get_db)):
    tag = await db.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail=f"标签 {tag_id} 不存在")

    await db.delete(tag)
    await db.commit()
    return to_camel_case([tag.to_dict()])[0]