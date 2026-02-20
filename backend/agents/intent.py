import json
from agents.utils.llm_client import create_llm_client
from agents.utils.prompt_loader import load_prompt


class IntentModule:
    """意图识别模块，用于判断用户是想开始新选题还是继续讨论当前文稿"""
    
    def __init__(self, agent_config: dict = None):
        """
        初始化意图识别模块
        
        Args:
            agent_config: 智能体配置，包含提示词路径等信息
        """
        self.module = {
            'llm_client': create_llm_client("deepseek"),
            'llm_model': "deepseek-chat"
        }
        self.agent_config = agent_config or {}
        
    def _get_system_prompt(self) -> str:
        """获取系统提示词"""
        prompt_dir = self.agent_config.get("default_prompt_dir", "agents/prompts/")
        system_prompt = load_prompt("intent", prompt_dir)
        return system_prompt

    def new_topic(self, user_input: str) -> tuple[bool, bool]:
        """
        判断用户输入的意图
        
        Args:
            user_input: 用户的输入内容
            
        Returns:
            tuple[bool, bool]: (is_new_topic, is_confirmed)
                - is_new_topic: True表示用户想开始新选题，False表示继续讨论当前文稿
                - is_confirmed: 当前版本始终返回False，预留给未来的二次确认功能
        """
        try:
            print(f"[IntentModule] 正在分析用户意图: {user_input[:50]}...")
            
            system_prompt = self._get_system_prompt()
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ]
            
            print("[IntentModule] 发送请求到LLM...")
            response = self.module["llm_client"].chat.completions.create(
                model=self.module["llm_model"],
                messages=messages,
                temperature=0.3  # 使用较低的temperature以获得更稳定的判断
            )
            
            completion = response.choices[0].message.content
            print(f"[IntentModule] 收到LLM响应: {completion[:100]}...")
            
            # 解析JSON响应
            try:
                # 尝试提取JSON部分（可能包含在代码块中）
                if "```json" in completion:
                    json_start = completion.find("```json") + 7
                    json_end = completion.find("```", json_start)
                    json_str = completion[json_start:json_end].strip()
                elif "```" in completion:
                    json_start = completion.find("```") + 3
                    json_end = completion.find("```", json_start)
                    json_str = completion[json_start:json_end].strip()
                else:
                    json_str = completion.strip()
                
                result = json.loads(json_str)
                is_new_topic = result.get("is_new_topic", False)
                confidence = result.get("confidence", 0.5)
                reason = result.get("reason", "未知原因")
                
                print(f"[IntentModule] 分析结果: is_new_topic={is_new_topic}, confidence={confidence}, reason={reason}")
                
                # 如果置信度较低（<0.6），保守地判断为继续讨论
                if confidence < 0.6:
                    print(f"[IntentModule] 置信度较低({confidence})，保守判断为继续讨论")
                    is_new_topic = False
                
                # 第二个返回值is_confirmed预留给未来的二次确认功能
                # 当前版本始终返回False
                is_confirmed = False
                
                return is_new_topic, is_confirmed
                
            except json.JSONDecodeError as e:
                print(f"[IntentModule] JSON解析失败: {e}")
                print(f"[IntentModule] 原始响应: {completion}")
                # 解析失败时，默认为继续讨论（保守策略）
                return False, False
                
        except Exception as e:
            print(f"[IntentModule] 意图识别出错: {e}")
            # 出错时默认为继续讨论（保守策略）
            return False, False