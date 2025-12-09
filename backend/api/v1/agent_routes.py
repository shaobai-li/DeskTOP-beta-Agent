from fastapi import APIRouter, HTTPException, status, Body
from pydantic import BaseModel
from typing import Optional, Dict, List
from services.agent_service import AgentService
from utils import to_snake_case  # 新增导入
from sqlalchemy.ext.asyncio import AsyncSession
from db import get_db
from fastapi import Depends

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
        agents = await AgentService.get_all_agents(db)
        return agents
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/agents/menu")
async def get_agents_menu(db: AsyncSession = Depends(get_db)):
    """获取知能体菜单"""
    try:
        menu = await AgentService.get_agents_menu(db)
        return menu
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
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
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/agents")
async def create_agent(agent_data: Dict = Body(...), db: AsyncSession = Depends(get_db)):
    """创建知能体"""
    try:
        # 前端发 camelCase，转成 snake_case
        snake_data = to_snake_case(agent_data)
        new_agent = await AgentService.create_agent(snake_data, db)
        return {
            "message": "创建成功",
            "agent": new_agent
        }
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.patch("/agents/{agent_id}")
async def update_agent(agent_id: str, update_data: Dict = Body(...), db: AsyncSession = Depends(get_db)):
    """部分更新知能体数据"""
    try:
        # 前端发 camelCase，转成 snake_case
        snake_data = to_snake_case(update_data)
        updated_agent = await AgentService.update_agent(agent_id, snake_data, db)
        return {
            "message": "更新成功",
            "agent": updated_agent
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
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
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

