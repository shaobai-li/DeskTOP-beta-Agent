from agents.utils.llm_client import create_llm_client

SYSTEM_PROMPT_DRAFT = """

"""

class DraftAgent:
    def __init__(self):
        self.module = {
            "llm_client": create_llm_client("deepseek"),
            "llm_model": "deepseek-chat"
        }

    def draft(self, topic: str) -> str:
        print("Entering draft...")
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_DRAFT},
            {"role": "user", "content": f"{topic}"}
            ]
        print("Sending messages to LLM...")
        response = self.module["llm_client"].chat.completions.create(
            model=self.module["llm_model"],
            messages=messages
            )
        print("Received response from LLM...")
        completion = response.choices[0].message.content
        print(completion)
        return completion



def main():
    draft_agent = DraftAgent()
    topic = """
<topic>
<title>【选题1】标题：如何平衡AI技术应用中的虚假信息风险？</title>
<subtitle>
- 灵感来源：AI模型在信息生成中的幻觉现象（<text>, <text 7>, <text 8>）
- 核心观点：AI生成内容中存在虚假信息的风险，这些信息可能快速传播并影响舆论环境。
- 内容方向：分析AI生成虚假信息的原理，探讨解决方案如多重信息验证、引入AI质检。
- 受众价值：提高公众对AI内容的鉴别意识，帮助开发者和应用者更好地管理AI输出质量。
</subtitle>
</topic>
"""
    result = draft_agent.draft(topic)
    print(result)

if __name__ == "__main__":
    main()