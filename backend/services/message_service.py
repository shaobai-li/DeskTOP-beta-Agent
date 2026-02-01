import json
from datetime import datetime
from typing import Optional, AsyncGenerator, List, Dict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from models.chat import Chat
from models.message import Message
from utils import uuid7, to_camel_case, to_snake_case
from agents import SearchAgent, TopicAnalysisAgent, StructureDraftAgent, FinalDraftAgent, IntentionModule
from services.agent_service import AgentService


class MessageService:
    """消息业务逻辑服务层"""

    def __init__(self):
        # agents 将在 _init_agents 中根据 selected_agent 初始化
        self.search_agent = None
        self.topic_analysis_agent = None
        self.draft_agent = None
        self.final_draft_agent = None
        self.intention_module = None
        self._current_agent_id = None
    
    async def _init_agents(self, selected_agent: str, db: AsyncSession):
        """根据 selected_agent (agent_id) 初始化各个 agent"""
        # 如果已经是同一个 agent，不需要重新初始化
        if self._current_agent_id == selected_agent:
            return
        
        # 获取 agent 配置
        agent_config = await AgentService.get_agent_by_id(selected_agent, db)
        if not agent_config:
            # 如果找不到配置，使用默认配置
            agent_config = {
                "persona_prompt": "",
                "usp_prompt": "",
                "default_prompt_dir": "agents/prompts/"
            }
        else:
            # 将 camelCase 转换回 snake_case，因为 agent 类期望 snake_case 键名
            agent_config = to_snake_case(agent_config)
        
        # 使用 agent 配置初始化各个 agent（SearchAgent 需要异步初始化）
        self.search_agent = await SearchAgent.create(agent_config)
        self.topic_analysis_agent = TopicAnalysisAgent(agent_config)
        self.draft_agent = StructureDraftAgent(agent_config)
        self.final_draft_agent = FinalDraftAgent(agent_config)
        self.intention_module = IntentionModule()
        self._current_agent_id = selected_agent

    def _yield_message(self, topic: str, content: str, is_status: bool = False) -> str:
        return json.dumps({
            "is_status_message": is_status,
            "topic": topic,
            "generated_content": content
        }) + "\n"

    @staticmethod
    async def create_chat(title: str, selected_agent: str, db: AsyncSession) -> str:
        """创建新的聊天记录，返回 chat_id"""
        chat_id = uuid7()
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        new_chat = Chat(
            chat_id=chat_id,
            title=title,
            selected_agent=selected_agent,
            created_at=now,
            updated_at=now
        )
        db.add(new_chat)
        await db.commit()
        await db.refresh(new_chat)
        
        return chat_id

    @staticmethod
    async def save_message(chat_id: str, content: str, role: str, journey_state: str, db: AsyncSession) -> str:
        """保存消息到数据库"""
        message_id = uuid7()
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        new_message = Message(
            message_id=message_id,
            chat_id=chat_id,
            role=role,
            content=content,
            created_at=now,
            journey_state=journey_state
        )
        db.add(new_message)
        
        # 更新 chat 的 updated_at
        chat = await db.get(Chat, chat_id)
        if chat:
            chat.updated_at = now
        
        await db.commit()
        await db.refresh(new_message)
        
        return message_id

    @staticmethod
    async def get_chat_messages(chat_id: str, db: AsyncSession) -> List[Dict]:
        """获取指定聊天的所有消息"""
        result = await db.execute(
            select(Message)
            .where(Message.chat_id == chat_id)
            .order_by(Message.message_id)
        )
        messages = result.scalars().all()
        return to_camel_case([message.to_dict() for message in messages])

    @staticmethod
    async def get_journey_state(chat_id: str, db: AsyncSession) -> str:
        """获取聊天的当前 journey_state"""
        result = await db.execute(
            select(Message.journey_state)
            .where(Message.chat_id == chat_id)
            .order_by(Message.created_at.desc())
            .limit(1)
        )
        journey_state = result.scalar_one_or_none()
        return journey_state if journey_state else "0"  # 默认状态

    async def begin_chat(self, topic: str, selected_agent: str, db: AsyncSession) -> dict:
        """快速创建会话并返回 chatId"""
        chat_id = await MessageService.create_chat(topic, selected_agent, db)
        message_id = await MessageService.save_message(chat_id, journey_state="0", content=topic, role="user", db=db)

        return {
            "chatId": chat_id,
            "messageId": message_id,
            "title": topic or "新对话",
            "selectedAgent": selected_agent
        }

    async def generate_content(self, topic: str, chat_id: str, selected_agent: str, db: AsyncSession) -> AsyncGenerator[str, None]:
        """处理聊天消息生成请求"""
        # 根据 selected_agent 初始化各个 agent
        if self._current_agent_id != selected_agent:
            await self._init_agents(selected_agent, db)

        journey_state = await MessageService.get_journey_state(chat_id, db)

        if journey_state == "0":
            yield self._yield_message(topic, "正在搜索文章库", is_status=True)
            
            chunks = self.search_agent.local_search(topic, 4)
            yield self._yield_message(topic, chunks)
            
            await MessageService.save_message(chat_id, journey_state=journey_state, content=chunks, role="assistant", db=db)

            yield self._yield_message(topic, "正在构思选题列表", is_status=True)
            topic_list = self.search_agent.content_framework(chunks)

            yield self._yield_message(topic, "正在分析选题列表", is_status=True)

            xml_topic = None
            for xml_topic in self.topic_analysis_agent.analyze_topic_list(topic_list):
                yield self._yield_message(topic, xml_topic)
                yield self._yield_message(topic, "正在分析选题列表", is_status=True)
                
                journey_state = "1"
                if xml_topic:
                    await MessageService.save_message(chat_id, journey_state=journey_state, content=str(xml_topic), role="assistant", db=db)

        elif journey_state == "1":
            yield self._yield_message(topic, "正在生成结构化的初稿", is_status=True)
            
            initial_draft = self.draft_agent.structure_draft(topic)
            
            # chunk_str = json.dumps({
            #     "is_status_message": False,
            #     "topic": topic,
            #     "generated_content": generated_draft
            # }) + "\n"
            # yield chunk_str

            journey_state = "1"
            await MessageService.save_message(chat_id, journey_state=journey_state, content=initial_draft, role="assistant", db=db)

            yield self._yield_message(topic, "正在进行终稿优化中", is_status=True)
            
            optimized_draft = self.final_draft_agent.get_final_draft(initial_draft)
            yield self._yield_message(topic, optimized_draft)

            journey_state = "2"
            await MessageService.save_message(chat_id, journey_state=journey_state, content=optimized_draft, role="assistant", db=db)        

        elif journey_state == "2":
            # todo: topic 其实是用户输入
            yield self._yield_message(topic, "正在思考", is_status=True)

            is_new_topic, is_confirmed = self.intention_module.new_topic(topic)

            if is_new_topic:
                if not is_confirmed:
                    yield self._yield_message(topic, "请确认是否需要重新生成选题")
            else:
                reply_content = self.final_draft_agent.discuss_on_draft(topic)
                yield self._yield_message(topic, reply_content)

                await MessageService.save_message(chat_id, journey_state=journey_state, content=reply_content, role="user", db=db)

        else:
            raise ValueError("Invalid journey state")