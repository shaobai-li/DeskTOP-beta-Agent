import json
from fastapi import APIRouter
from config.settings import JSON_DEV_AGENTS_PATH
from .utils import *

router = APIRouter()

@router.get("/agents")
def get_agents():
    """读取所有知能体数据"""
    if not JSON_DEV_AGENTS_PATH.exists():
        return {"error": "知能体数据文件不存在"}

    with open(JSON_DEV_AGENTS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    return to_camel_case(data.get("agents", []))

@router.patch("/agents/{agent_id}")
def update_agent(agent_id: str, update_data: dict):
    """部分更新知能体数据"""
    if not JSON_DEV_AGENTS_PATH.exists():
        return {"error": "知能体数据文件不存在"}

    with open(JSON_DEV_AGENTS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    agents = data.get("agents", [])
    target_agent = next((a for a in agents if a.get("agent_id") == agent_id), None)

    if not target_agent:
        return {"error": f"知能体 {agent_id} 不存在"}

    for key, value in to_snake_case(update_data).items():
        target_agent[key] = value

    with open(JSON_DEV_AGENTS_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    return {"message": "更新成功", "agent": target_agent}

@router.post("/agents")
def create_agent(agent_data: dict):
    """创建知能体"""
    if not JSON_DEV_AGENTS_PATH.exists():
        return {"error": "知能体数据文件不存在"}
    with open(JSON_DEV_AGENTS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    agents = data.get("agents", [])

    import time
    new_agent_id = f"agent_{int(time.time())}"

    snake_data = to_snake_case(agent_data)

    new_agent = {
        "agent_id": new_agent_id,
        "title": snake_data.get("title", "未命名智能体"),
        "profile": "",
        "quadrant_prompt": "",
        "script_generation_prompt": "",
        "language_style_prompt": ""
    }

    agents.append(new_agent)
    data["agents"] = agents

    with open(JSON_DEV_AGENTS_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    return {"message": "创建成功", "agent": to_camel_case(new_agent)}