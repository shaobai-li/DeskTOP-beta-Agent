from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field
from typing import List, Optional
from services.tag_service import TagService
from db import get_db

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
    """获取所有标签"""
    try:
        return await TagService.get_all_tags(db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取标签失败: {str(e)}"
        )


@router.post("/tags", status_code=status.HTTP_201_CREATED, response_model=dict)
async def create_tag(tag_in: TagCreate, db: AsyncSession = Depends(get_db)):
    """创建新标签"""
    try:
        return await TagService.create_tag(
            name=tag_in.name,
            description=tag_in.description,
            origin_note=tag_in.origin_note,
            db=db
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"创建标签失败: {str(e)}"
        )


@router.put("/tags/{tag_id}", response_model=dict)
async def update_tag(tag_id: str, tag_in: TagUpdate, db: AsyncSession = Depends(get_db)):
    """更新标签"""
    try:
        return await TagService.update_tag(
            tag_id=tag_id,
            name=tag_in.name,
            description=tag_in.description,
            origin_note=tag_in.origin_note,
            db=db
        )
    except ValueError as e:
        status_code = status.HTTP_400_BAD_REQUEST if "已存在" in str(e) or "不能为空" in str(e) else status.HTTP_404_NOT_FOUND
        raise HTTPException(
            status_code=status_code,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新标签失败: {str(e)}"
        )


@router.delete("/tags/{tag_id}", response_model=dict)
async def delete_tag(tag_id: str, db: AsyncSession = Depends(get_db)):
    """删除标签"""
    try:
        return await TagService.delete_tag(tag_id, db=db)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除标签失败: {str(e)}"
        )

