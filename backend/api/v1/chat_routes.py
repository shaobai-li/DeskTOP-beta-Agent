from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from services.chat_service import ChatService
from db import get_db

router = APIRouter()


class ChatUpdate(BaseModel):
    title: Optional[str] = None
    updated_at: Optional[str] = None


@router.get("/chats")
async def get_chats(db: AsyncSession = Depends(get_db)):
    """获取所有聊天记录"""
    try:
        return await ChatService.get_all_chats(db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取聊天记录失败: {str(e)}"
        )


@router.patch("/chat/{chat_id}")
async def update_chat(chat_id: str, update_data: ChatUpdate, db: AsyncSession = Depends(get_db)):
    """更新聊天记录"""
    try:
        return await ChatService.update_chat(
            chat_id,
            title=update_data.title,
            updated_at=update_data.updated_at,
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
            detail=f"更新聊天记录失败: {str(e)}"
        )


@router.delete("/chat/{chat_id}")
async def delete_chat(chat_id: str, db: AsyncSession = Depends(get_db)):
    """删除指定的聊天记录及其相关消息"""
    try:
        deleted_chat = await ChatService.delete_chat(chat_id, db)
        return {
            "message": "删除成功",
            "deletedChat": deleted_chat
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除聊天记录失败: {str(e)}"
        )

