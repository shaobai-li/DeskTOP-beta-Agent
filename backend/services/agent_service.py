from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List, Dict, Optional
from datetime import datetime
from models.agent import Agent
from models.tag import Tag
from utils import to_snake_case, to_camel_case, uuid7


class AgentService:
    """知能体业务逻辑服务层"""

    @staticmethod
    async def get_all_agents(db: AsyncSession) -> List[Dict]:
        """获取所有知能体数据（包含关联的标签）"""
        result = await db.execute(
            select(Agent)
            .options(selectinload(Agent.tags))
            .order_by(Agent.agent_id.asc())
        )
        agents = result.scalars().all()
        
        agents_list = []
        for agent in agents:
            agent_dict = agent.to_dict()
            # 添加标签信息（如果需要）
            tags_info = [{"tagId": tag.tag_id, "name": tag.name} for tag in agent.tags]
            agent_dict['tags'] = tags_info
            agents_list.append(agent_dict)
        
        return to_camel_case(agents_list)

    @staticmethod
    async def get_agents_menu(db: AsyncSession) -> List[Dict]:
        """获取知能体菜单（仅包含 agent_id 和 title）"""
        result = await db.execute(
            select(Agent).order_by(Agent.agent_id.asc())
        )
        agents = result.scalars().all()
        
        menu = [{
            "agent_id": agent.agent_id,
            "title": agent.title,
        } for agent in agents]
        
        return to_camel_case(menu)

    @staticmethod
    async def get_agent_by_id(agent_id: str, db: AsyncSession) -> Optional[Dict]:
        """根据 agent_id 获取知能体数据"""
        result = await db.execute(
            select(Agent)
            .options(selectinload(Agent.tags))
            .where(Agent.agent_id == agent_id)
        )
        agent = result.scalar_one_or_none()
        
        if agent:
            agent_dict = agent.to_dict()
            # 添加标签信息
            tags_info = [{"tagId": tag.tag_id, "name": tag.name} for tag in agent.tags]
            agent_dict['tags'] = tags_info
            return to_camel_case([agent_dict])[0]
        return None

    @staticmethod
    async def create_agent(agent_data: dict, db: AsyncSession) -> Dict:
        """创建新的知能体"""
        snake_data = to_snake_case(agent_data)
        title = snake_data.get("title", "未命名智能体").strip()
        tag_ids = snake_data.get("tag_ids", []) or []
        
        # 过滤掉空值
        if isinstance(tag_ids, list):
            tag_ids = [tid for tid in tag_ids if tid]
        
        # 检查标题是否已存在
        result = await db.execute(
            select(Agent).where(Agent.title == title)
        )
        if result.scalar_one_or_none():
            raise ValueError("知能体标题已存在")
        
        new_agent = Agent(
            agent_id=uuid7(),
            title=title,
            persona_prompt=snake_data.get("persona_prompt", ""),
            usp_prompt=snake_data.get("usp_prompt", ""),
            default_prompt_dir=snake_data.get("default_prompt_dir", "agents/prompts/")
        )
        
        # 如果提供了标签ID，关联标签
        if tag_ids:
            result = await db.execute(
                select(Tag).where(Tag.tag_id.in_(tag_ids))
            )
            tags = result.scalars().all()
            if len(tags) != len(tag_ids):
                raise ValueError("部分标签不存在")
            new_agent.tags = tags
        else:
            # 确保空标签列表
            new_agent.tags = []
        
        db.add(new_agent)
        await db.commit()
        await db.refresh(new_agent)
        
        # 重新查询以加载标签关系
        result = await db.execute(
            select(Agent)
            .options(selectinload(Agent.tags))
            .where(Agent.agent_id == new_agent.agent_id)
        )
        new_agent = result.scalar_one()
        
        agent_dict = new_agent.to_dict()
        tags_info = [{"tagId": tag.tag_id, "name": tag.name} for tag in new_agent.tags]
        agent_dict['tags'] = tags_info
        return to_camel_case([agent_dict])[0]

    @staticmethod
    async def update_agent(agent_id: str, update_data: dict, db: AsyncSession) -> Dict:
        """部分更新知能体数据"""
        result = await db.execute(
            select(Agent)
            .options(selectinload(Agent.tags))
            .where(Agent.agent_id == agent_id)
        )
        agent = result.scalar_one_or_none()
        
        if not agent:
            raise ValueError(f"知能体 {agent_id} 不存在")
        
        snake_data = to_snake_case(update_data)
        
        if "title" in snake_data and snake_data["title"] is not None:
            agent.title = snake_data["title"]
        if "persona_prompt" in snake_data and snake_data["persona_prompt"] is not None:
            agent.persona_prompt = snake_data["persona_prompt"]
        if "usp_prompt" in snake_data and snake_data["usp_prompt"] is not None:
            agent.usp_prompt = snake_data["usp_prompt"]
        if "default_prompt_dir" in snake_data and snake_data["default_prompt_dir"] is not None:
            agent.default_prompt_dir = snake_data["default_prompt_dir"]
        
        await db.commit()
        await db.refresh(agent)
        
        agent_dict = agent.to_dict()
        tags_info = [{"tagId": tag.tag_id, "name": tag.name} for tag in agent.tags]
        agent_dict['tags'] = tags_info
        return to_camel_case([agent_dict])[0]

    @staticmethod
    async def update_agent_tags(agent_id: str, tag_ids: List[str], db: AsyncSession) -> Dict:
        """更新知能体的标签关联"""
        result = await db.execute(
            select(Agent)
            .options(selectinload(Agent.tags))
            .where(Agent.agent_id == agent_id)
        )
        agent = result.scalar_one_or_none()
        
        if not agent:
            raise ValueError(f"知能体 {agent_id} 不存在")
        
        # 获取要关联的标签
        if tag_ids:
            result = await db.execute(
                select(Tag).where(Tag.tag_id.in_(tag_ids))
            )
            tags = result.scalars().all()
            if len(tags) != len(tag_ids):
                raise ValueError("部分标签不存在")
        else:
            tags = []
        
        # 更新关联关系
        agent.tags = tags
        await db.commit()
        await db.refresh(agent)
        
        agent_dict = agent.to_dict()
        tags_info = [{"tagId": tag.tag_id, "name": tag.name} for tag in agent.tags]
        agent_dict['tags'] = tags_info
        return to_camel_case([agent_dict])[0]

    @staticmethod
    async def save_agent(agent_id: str, save_data: dict, db: AsyncSession) -> Dict:
        """保存知能体的所有数据（包括提示词和标签）"""
        result = await db.execute(
            select(Agent)
            .options(selectinload(Agent.tags))
            .where(Agent.agent_id == agent_id)
        )
        agent = result.scalar_one_or_none()
        
        if not agent:
            raise ValueError(f"知能体 {agent_id} 不存在")
        
        snake_data = to_snake_case(save_data)
        
        # 更新提示词字段
        if "persona_prompt" in snake_data:
            agent.persona_prompt = snake_data["persona_prompt"] or ""
        if "usp_prompt" in snake_data:
            agent.usp_prompt = snake_data["usp_prompt"] or ""
        
        # 更新标签关联
        if "tag_ids" in snake_data:
            tag_ids = snake_data["tag_ids"] or []
            # 过滤掉空值
            if isinstance(tag_ids, list):
                tag_ids = [tid for tid in tag_ids if tid]
            
            if tag_ids:
                result = await db.execute(
                    select(Tag).where(Tag.tag_id.in_(tag_ids))
                )
                tags = result.scalars().all()
                if len(tags) != len(tag_ids):
                    raise ValueError("部分标签不存在")
                agent.tags = tags
            else:
                agent.tags = []
        
        await db.commit()
        await db.refresh(agent)
        
        # 重新查询以加载标签关系
        result = await db.execute(
            select(Agent)
            .options(selectinload(Agent.tags))
            .where(Agent.agent_id == agent_id)
        )
        agent = result.scalar_one()
        
        agent_dict = agent.to_dict()
        tags_info = [{"tagId": tag.tag_id, "name": tag.name} for tag in agent.tags]
        agent_dict['tags'] = tags_info
        return to_camel_case([agent_dict])[0]

    @staticmethod
    async def delete_agent(agent_id: str, db: AsyncSession) -> Dict:
        """删除指定的知能体"""
        agent = await db.get(Agent, agent_id)
        
        if not agent:
            raise ValueError(f"知能体 {agent_id} 不存在")
        
        deleted_agent_dict = agent.to_dict()
        deleted_agent_dict['tags'] = []
        
        await db.delete(agent)
        await db.commit()
        
        return to_camel_case([deleted_agent_dict])[0]

