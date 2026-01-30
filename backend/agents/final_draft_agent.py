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
        self.draft = None
        self.discussion_messages = []
    def _get_system_prompt(self) -> str:
        """获取系统提示词，直接从 agent_config 获取 usp_prompt"""
        prompt_dir = self.agent_config.get("default_prompt_dir", "agents/prompts/")
        system_prompt_final_draft = load_prompt("final_draft", prompt_dir)
        return system_prompt_final_draft

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

    def get_final_draft(self, input_draft: str):
        print("Entering final_draft...")
        system_prompt = self._get_system_prompt()
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"请以下面的结构化的初稿为基础，进行优化生成终稿：{input_draft}"}
            ]
        print("Sending messages to LLM...")
        response = self.module["llm_client"].chat.completions.create(
            model=self.module["llm_model"],
            messages=messages
            )
        print("Received response from LLM...")
        completion = response.choices[0].message.content
        self.draft = completion
        return completion

    def discuss_on_draft(self, user_input: str):
        print("Entering discuss_on_draft...")
        if self.discussion_messages == []:
            self.discussion_messages.append({"role": "system", "content": "你是一个专业的编辑，请根据用户的问题，对文稿进行讨论，并给出修改意见。文稿如下：\n{self.draft}"})
        self.discussion_messages.append({"role": "user", "content": user_input})
        print("Sending messages to LLM...")
        response = self.module["llm_client"].chat.completions.create(
            model=self.module["llm_model"],
            messages=self.discussion_messages
            )
        print("Received response from LLM...")
        completion = response.choices[0].message.content
        self.discussion_messages.append({"role": "assistant", "content": completion})
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