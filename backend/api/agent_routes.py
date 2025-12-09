from fastapi import APIRouter, HTTPException, status, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, Dict, List
from services.agent_service import AgentService
from db import get_db

router = APIRouter()


class AgentCreate(BaseModel):
    """创建知能体的请求模型"""
    title: Optional[str] = "未命名智能体"
    persona_prompt: Optional[str] = ""
    language_style_prompt: Optional[str] = ""
    default_prompt_dir: Optional[str] = "agents/prompts/"


class AgentUpdate(BaseModel):
    """更新知能体的请求模型"""
    title: Optional[str] = None
    persona_prompt: Optional[str] = None
    language_style_prompt: Optional[str] = None
    default_prompt_dir: Optional[str] = None


@router.get("/agents")
async def get_agents(db: AsyncSession = Depends(get_db)):
    """读取所有知能体数据"""
    try:
        return await AgentService.get_all_agents(db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取知能体失败: {str(e)}"
        )


@router.get("/agents/menu")
async def get_agents_menu(db: AsyncSession = Depends(get_db)):
    """获取知能体菜单"""
    try:
        return await AgentService.get_agents_menu(db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取知能体菜单失败: {str(e)}"
        )


@router.post("/agents", status_code=status.HTTP_201_CREATED)
async def create_agent(agent_data: Dict = Body(...), db: AsyncSession = Depends(get_db)):
    """创建知能体"""
    try:
        new_agent = await AgentService.create_agent(agent_data, db)
        return {
            "message": "创建成功",
            "agent": new_agent
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        import traceback
        error_detail = f"创建知能体失败: {str(e)}\n{traceback.format_exc()}"
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_detail
        )


@router.patch("/agents/{agent_id}/tags")
async def update_agent_tags(agent_id: str, tag_ids: List[str] = Body(...), db: AsyncSession = Depends(get_db)):
    """更新知能体的标签关联"""
    try:
        updated_agent = await AgentService.update_agent_tags(agent_id, tag_ids, db)
        return {
            "message": "更新标签成功",
            "agent": updated_agent
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新标签失败: {str(e)}"
        )


@router.get("/agents/{agent_id}")
async def get_agent(agent_id: str, db: AsyncSession = Depends(get_db)):
    """读取指定知能体数据"""
    try:
        agent = await AgentService.get_agent_by_id(agent_id, db)
        if agent is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"知能体 {agent_id} 不存在"
            )
        return agent
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取知能体失败: {str(e)}"
        )


@router.patch("/agents/{agent_id}")
async def update_agent(agent_id: str, update_data: Dict = Body(...), db: AsyncSession = Depends(get_db)):
    """部分更新知能体数据"""
    try:
        updated_agent = await AgentService.update_agent(agent_id, update_data, db)
        return {
            "message": "更新成功",
            "agent": updated_agent
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新知能体失败: {str(e)}"
        )


@router.post("/agents/{agent_id}/save")
async def save_agent(agent_id: str, save_data: Dict = Body(...), db: AsyncSession = Depends(get_db)):
    """保存知能体的所有数据（包括提示词和标签）"""
    try:
        saved_agent = await AgentService.save_agent(agent_id, save_data, db)
        return {
            "message": "保存成功",
            "agent": saved_agent
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"保存知能体失败: {str(e)}"
        )


@router.delete("/agents/{agent_id}")
async def delete_agent(agent_id: str, db: AsyncSession = Depends(get_db)):
    """删除指定的知能体"""
    try:
        deleted_agent = await AgentService.delete_agent(agent_id, db)
        return {
            "message": "删除成功",
            "deleted_agent": deleted_agent
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除知能体失败: {str(e)}"
        )

