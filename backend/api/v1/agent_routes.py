from fastapi import APIRouter, HTTPException, status, Body
from pydantic import BaseModel
from typing import Optional, Dict, List
from services.agent_service import AgentService
from utils import to_snake_case  # 新增导入

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
def get_agents():
    """读取所有知能体数据"""
    try:
        agents = AgentService.get_all_agents()
        return agents
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/agents/menu")
def get_agents_menu():
    """获取知能体菜单"""
    try:
        menu = AgentService.get_agents_menu()
        return menu
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/agents/{agent_id}")
def get_agent(agent_id: str):
    """读取指定知能体数据"""
    try:
        agent = AgentService.get_agent_by_id(agent_id)
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
def create_agent(agent_data: Dict = Body(...)):
    """创建知能体"""
    try:
        # 前端发 camelCase，转成 snake_case
        snake_data = to_snake_case(agent_data)
        new_agent = AgentService.create_agent(snake_data)
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
def update_agent(agent_id: str, update_data: Dict = Body(...)):
    """部分更新知能体数据"""
    try:
        # 前端发 camelCase，转成 snake_case
        snake_data = to_snake_case(update_data)
        updated_agent = AgentService.update_agent(agent_id, snake_data)
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
def delete_agent(agent_id: str):
    """删除指定的知能体"""
    try:
        deleted_agent = AgentService.delete_agent(agent_id)
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

