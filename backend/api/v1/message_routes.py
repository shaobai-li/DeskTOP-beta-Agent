from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.message_service import MessageService
from db import get_db

router = APIRouter()

# 初始化 service
message_service = MessageService()


class UserQuery(BaseModel):
    topic: str
    chat_id: Optional[str] = None
    selected_agent: str


class MetadataUpdate(BaseModel):
    metadata: Dict[str, Any]


@router.post("/messages/begin")
async def begin_chat(request: UserQuery, db: AsyncSession = Depends(get_db)):
    """
    快速创建会话并返回 chatId
    这是一个快速 ACT 回复端点，便于前端立即获得 chatId
    """
    try:
        result = await message_service.begin_chat(request.topic, request.selected_agent, db)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"创建会话失败: {str(e)}"
        )


@router.post("/messages/stream")
async def generate_content(query: UserQuery, db: AsyncSession = Depends(get_db)):
    """处理聊天消息生成请求"""
    try:
        return StreamingResponse(
            message_service.generate_content(query.topic, query.chat_id, query.selected_agent, db),
            media_type="application/json"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"生成内容失败: {str(e)}"
        )


@router.get("/messages/{chat_id}")
async def get_chat_messages(chat_id: str, db: AsyncSession = Depends(get_db)):
    """获取指定聊天的所有消息"""
    try:
        return await MessageService.get_chat_messages(chat_id, db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取消息失败: {str(e)}"
        )


@router.patch("/messages/{message_id}/metadata")
async def update_message_metadata(
    message_id: str,
    request: MetadataUpdate,
    db: AsyncSession = Depends(get_db)
):
    """更新消息的 metadata"""
    try:
        success = await MessageService.update_message_metadata(
            message_id, request.metadata, db
        )
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="消息不存在"
            )
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新 metadata 失败: {str(e)}"
        )