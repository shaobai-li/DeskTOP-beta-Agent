import json
from pathlib import Path
from typing import List, Dict, Optional
from config.settings import JSON_DEV_AGENTS_PATH
from utils import to_snake_case, to_camel_case, uuid7


class AgentService:
    """知能体业务逻辑服务层"""

    @staticmethod
    def _load_data() -> dict:
        """加载知能体数据文件"""
        if not JSON_DEV_AGENTS_PATH.exists():
            raise FileNotFoundError("知能体数据文件不存在")
        
        with open(JSON_DEV_AGENTS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)

    @staticmethod
    def _save_data(data: dict) -> None:
        """保存知能体数据到文件"""
        with open(JSON_DEV_AGENTS_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

    @staticmethod
    def get_all_agents() -> List[Dict]:
        """获取所有知能体数据"""
        data = AgentService._load_data()
        agents = data.get("agents", [])
        return to_camel_case(agents)

    @staticmethod
    def get_agents_menu() -> List[Dict]:
        """获取知能体菜单（仅包含 agent_id 和 title）"""
        data = AgentService._load_data()
        agents = data.get("agents", [])
        
        menu = [{
            "agent_id": agent.get("agent_id"),
            "title": agent.get("title"),
        } for agent in agents]
        
        return to_camel_case(menu)

    @staticmethod
    def get_agent_by_id(agent_id: str) -> Optional[Dict]:
        """根据 agent_id 获取知能体数据"""
        data = AgentService._load_data()
        agents = data.get("agents", [])
        
        agent = next((a for a in agents if a.get("agent_id") == agent_id), None)
        
        if agent:
            return to_camel_case(agent)
        return None

    @staticmethod
    def create_agent(agent_data: dict) -> Dict:
        """创建新的知能体"""
        data = AgentService._load_data()
        agents = data.get("agents", [])
        
        snake_data = to_snake_case(agent_data)
        
        new_agent = {
            "agent_id": uuid7(),
            "title": snake_data.get("title", "未命名智能体"),
            "persona_prompt": snake_data.get("persona_prompt", ""),
            "language_style_prompt": snake_data.get("language_style_prompt", ""),
            "default_prompt_dir": snake_data.get("default_prompt_dir", "agents/prompts/")
        }
        
        agents.append(new_agent)
        data["agents"] = agents
        
        AgentService._save_data(data)
        
        return to_camel_case(new_agent)

    @staticmethod
    def update_agent(agent_id: str, update_data: dict) -> Dict:
        """部分更新知能体数据"""
        data = AgentService._load_data()
        agents = data.get("agents", [])
        
        target_agent = next((a for a in agents if a.get("agent_id") == agent_id), None)
        
        if not target_agent:
            raise ValueError(f"知能体 {agent_id} 不存在")
        
        for key, value in to_snake_case(update_data).items():
            target_agent[key] = value
        
        AgentService._save_data(data)
        
        return to_camel_case(target_agent)

    @staticmethod
    def delete_agent(agent_id: str) -> Dict:
        """删除指定的知能体"""
        data = AgentService._load_data()
        agents = data.get("agents", [])
        
        # 查找目标 agent 的索引
        target_index = None
        for i, agent in enumerate(agents):
            if agent.get("agent_id") == agent_id:
                target_index = i
                break
        
        if target_index is None:
            raise ValueError(f"知能体 {agent_id} 不存在")
        
        # 执行删除
        deleted_agent = agents.pop(target_index)
        data["agents"] = agents
        
        AgentService._save_data(data)
        
        return to_camel_case(deleted_agent)

