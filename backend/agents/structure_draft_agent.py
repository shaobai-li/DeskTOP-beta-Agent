from agents.utils.llm_client import create_llm_client
from agents.utils.prompt_loader import load_prompt


class StructureDraftAgent:
    def __init__(self, agent_config: dict = None):
        """
        初始化 StructureDraftAgent
        
        Args:
            agent_config: 智能体配置，包含 persona_prompt 和 default_prompt_dir
        """
        self.module = {
            "llm_client": create_llm_client("deepseek"),
            "llm_model": "deepseek-chat"
        }
        self.agent_config = agent_config or {}
        
    def _build_system_prompt(self) -> str:
        """构建系统提示词"""
        # 从 agent_config 获取 prompt_dir，使用它来加载 draft 提示词
        prompt_dir = self.agent_config.get("default_prompt_dir", "agents/prompts/")
        system_prompt_structure_draft = load_prompt("structure_draft", prompt_dir)
        
        # 从 agent_config 直接获取 persona_prompt
        # persona_prompt = self.agent_config.get("persona_prompt", "")
        # print("Persona prompt:", persona_prompt)
        
        # if persona_prompt:
        #     return '\n\n'.join([system_prompt_draft, persona_prompt])
        return system_prompt_structure_draft

    def structure_draft(self, topic: str) -> str:
        print("Entering structure_draft...")
        system_prompt = self._build_system_prompt()
        messages=[
            {"role": "system", "content": system_prompt},
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
    structure_draft_agent = StructureDraftAgent()
    topic = """【选题4】自我介绍如何做到“有的放矢”？
- 灵感来源：<text 7>, <text 10>  
- 核心观点：自我介绍需结构化（头身尾），突出匹配、优秀、热情，并用故事案例支撑。
- 内容方向：解析三段式结构（基本信息+亮点故事+核心论证）；探讨如何提炼高光经历、调整表达弹性。
- 受众价值：提升面试开场表现，让面试官快速记住并认可求职者价值。
{
    "target_audience": {
        "description": "求职面试人群，特别是需要优化自我介绍环节的求职者",
        "reason": "选题明确指向面试场景，受众为需要提升面试开场表现的求职者"
    },
    "provided_value": {
        "description": "提供结构化的自我介绍方法论和具体操作步骤",
        "reason": "内容方向包含三段式结构解析、高光经历提炼方法等具体操作指导"
    },
    "quadrant_assessment": {
        "quadrant": "第一象限",
        "reason": "针对垂直的求职面试人群，提供可操作的结构化方法和具体步骤"
    },
    "priority_recommendation": {
        "priority_level": "高",
        "reason": "求职面试是刚需场景，结构化方法具有强实用性和可复制性",
        "execution_suggestions": ["可补充具体案例模板供用户直接套用", "建议增加不同行业/岗位的自我介绍差异化调整技巧", "可制作checklist帮助用户自检完善"]
    }
}
"""
    result = structure_draft_agent.structure_draft(topic)
    print(result)

if __name__ == "__main__":
    main()