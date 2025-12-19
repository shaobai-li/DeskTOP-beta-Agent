from agents.utils.llm_client import create_llm_client
from agents.utils.prompt_loader import load_prompt

class FinalDraftAgent:
    def __init__(self, agent_config: dict = None):
        """
        初始化 FinalDraftAgent
        
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
        prompt_dir = self.agent_config.get("default_prompt_dir", "agents/prompts/")
        system_prompt_final_draft = load_prompt("final_draft", prompt_dir)

        # 从 agent_config 直接获取 persona_prompt
        persona_prompt = self.agent_config.get("persona_prompt", "")
        print("Add in FinalDraftAgent Persona prompt:", persona_prompt[0:20], "...")
        
        usp_prompt = self.agent_config.get("usp_prompt", "")
        print("Add in FinalDraftAgent usp_prompt:", usp_prompt[0:20], "...")

        return '\n\n'.join([system_prompt_final_draft, persona_prompt, usp_prompt])

    def final_draft(self, topic: str):
        print("Entering final_draft...")
        system_prompt = self._get_system_prompt()
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"请以下面的结构化的初稿为基础，进行优化生成终稿：{topic}"}
            ]
        print("Sending messages to LLM...")
        response = self.module["llm_client"].chat.completions.create(
            model=self.module["llm_model"],
            messages=messages
            )
        print("Received response from LLM...")
        completion = response.choices[0].message.content
        return completion

def main():
    final_draft_agent = FinalDraftAgent()
    topic = """
    你好，我想了解产品
    """
    result = final_draft_agent.final_draft(topic)
    print(result)

if __name__=="__main__":
    main()