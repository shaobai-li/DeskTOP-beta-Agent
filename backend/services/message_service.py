import json
from datetime import datetime
from typing import Any, Optional, AsyncGenerator, List, Dict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from models.chat import Chat
from models.message import Message
from utils import uuid7, to_camel_case, to_snake_case
from agents import SearchAgent, TopicAnalysisAgent, StructureDraftAgent, FinalDraftAgent, IntentModule
from services.agent_service import AgentService


class MessageService:
    """消息业务逻辑服务层"""

    def __init__(self):
        # agents 将在 _init_agents 中根据 selected_agent 初始化
        self.search_agent = None
        self.topic_analysis_agent = None
        self.draft_agent = None
        self.final_draft_agent = None
        self.intent_module = None
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
        self.intent_module = IntentModule(agent_config)
        self._current_agent_id = selected_agent

    def _yield_message(
        self, 
        content: str,
        message_id: str,
        event: str = "message",  # "message" or "status"
        index: int = 1,
        chunking: bool = False,
    ) -> str:
        message = {
            "event": event,
            "id": message_id,
            "data": {
                "content": content,
                "index": index,
                "chunking": chunking
            }
        }
            
        return json.dumps(message) + "\n"

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
    async def save_message(chat_id: str, content: str, role: str, journey_state: str, message_id: str, db: AsyncSession) -> str:
        """保存消息到数据库"""
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
    async def update_message_metadata(message_id: str, metadata: Dict, db: AsyncSession) -> bool:
        """更新消息的 metadata"""
        message = await db.get(Message, message_id)
        if not message:
            return False
        
        message.meta_data = metadata
        await db.commit()
        return True

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
        message_id = uuid7()
        await MessageService.save_message(chat_id, journey_state="0", content=topic, role="user", message_id=message_id, db=db)

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
            status_message_id = uuid7()
            yield self._yield_message("正在搜索文章库", message_id=status_message_id, event="status")
            
            chunks = self.search_agent.local_search(topic, 4)
            message_id = uuid7()
            yield self._yield_message(chunks, message_id=message_id, event="message")
            
            await MessageService.save_message(chat_id, journey_state=journey_state, content=chunks, role="assistant", message_id=message_id, db=db)

            status_message_id = uuid7()
            yield self._yield_message("正在构思选题列表", message_id=status_message_id, event="status")
            topic_list = self.search_agent.content_framework(chunks)

            status_message_id = uuid7()
            yield self._yield_message("正在分析选题列表", message_id=status_message_id, event="status")

            # 流式发送 topics，边生成边发送
            all_topics = []  # 用于最后保存到数据库
            message_id = uuid7()  # 为整个 topics 流生成统一的 message_id
            index = 0
            
            topic_generator = self.topic_analysis_agent.analyze_topic_list(topic_list)
            for xml_topic in topic_generator:
                all_topics.append(xml_topic)
                index += 1
                
                # 发送 topic 内容，使用 chunking=True 表示还有更多内容
                yield self._yield_message(
                    xml_topic,
                    message_id=message_id,
                    event="message",
                    index=index,
                    chunking=True
                )
                    
                status_message_id = uuid7()
                yield self._yield_message("正在分析选题列表", message_id=status_message_id, event="status")
            
            # 保存所有 topics 到数据库
            if all_topics:
                journey_state = "1"
                all_topics_content = '\n'.join(all_topics)
                await MessageService.save_message(chat_id, journey_state=journey_state, content=all_topics_content, role="assistant", message_id=message_id, db=db)

        elif journey_state == "1":
            status_message_id = uuid7()
            yield self._yield_message("正在生成结构化的初稿", message_id=status_message_id, event="status")
            
            initial_draft = self.draft_agent.structure_draft(topic)
            
            # chunk_str = json.dumps({
            #     "is_status_message": False,
            #     "topic": topic,
            #     "generated_content": generated_draft
            # }) + "\n"
            # yield chunk_str

            journey_state = "1"
            message_id = uuid7()
            await MessageService.save_message(chat_id, journey_state=journey_state, content=initial_draft, role="assistant", message_id=message_id, db=db)

            status_message_id = uuid7()
            yield self._yield_message("正在进行终稿优化中", message_id=status_message_id, event="status")
            
            optimized_draft = self.final_draft_agent.get_final_draft(initial_draft)
            message_id = uuid7()
            yield self._yield_message(optimized_draft, message_id=message_id, event="message")

            journey_state = "2"
            await MessageService.save_message(chat_id, journey_state=journey_state, content=optimized_draft, role="assistant", message_id=message_id, db=db)        

        elif journey_state == "2":
            # todo: topic 其实是用户输入
            status_message_id = uuid7()
            yield self._yield_message("正在思考", message_id=status_message_id, event="status")

            is_new_topic, is_confirmed = self.intent_module.new_topic(topic)

            if is_new_topic:
                if not is_confirmed:
                    message_id = uuid7()
                    yield self._yield_message("<intent>进入新一轮的选题流程</intent>", message_id=message_id, event="message")
            else:
                reply_content = self.final_draft_agent.discuss_on_draft(topic)
                message_id = uuid7()
                yield self._yield_message(reply_content, message_id=message_id, event="message")

                await MessageService.save_message(chat_id, journey_state=journey_state, content=reply_content, role="user", message_id=message_id, db=db)

        else:
            raise ValueError("Invalid journey state")