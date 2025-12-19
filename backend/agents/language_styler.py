from agents.utils.llm_client import create_llm_client


class LanguageStyler:
    def __init__(self, agent_config: dict = None):
        """
        初始化 LanguageStyler
        
        Args:
            agent_config: 智能体配置，包含 usp_prompt
        """
        self.module = {
            'llm_client': create_llm_client("deepseek"),
            'llm_model' : "deepseek-chat"
        }
        self.agent_config = agent_config or {}
    
    def _get_system_prompt(self) -> str:
        """获取系统提示词，直接从 agent_config 获取 usp_prompt"""
        print("usp_prompt:", self.agent_config.get("usp_prompt", ""))
        return self.agent_config.get("usp_prompt", "")

    def styler(self, topic: str):
        system_prompt = self._get_system_prompt()
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"请将以下内容进行语言风格化：{topic}"}
            ]
        response = self.module["llm_client"].chat.completions.create(
            model=self.module["llm_model"],
            messages=messages
            )
        
        completion = response.choices[0].message.content
        print(completion)
        return completion

def main():
    language_agnet = LanguageStyler()
    topic = """
    你好，我想了解产品
    """
    result = language_agnet.styler(topic)
    print(result)

if __name__=="__main__":
    main()