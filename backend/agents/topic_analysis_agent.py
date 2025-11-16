from agents.utils.llm_client import create_llm_client



SYSTEM_PROMPT_TOPIC_ANALYSIS = """
你是一名资深自媒体策划与选题评审官。
目标：对我提供的结构化选题输入进行“选题四象限法”判断，并生成标准化 JSON结果，帮助创作者明确：①目标受众是谁；②提供什么价值；③该选题处于哪个象限；④优先级与执行建议。

四象限定义与判定
[
维度：人群（垂直/泛）× 选题（垂直/泛）
第一象限（右上）：垂直人群 × 垂直选题
“对某一具体人群，给出可复制、可落地的步骤/模板/案例，操作性强。”
第二象限（左上）：垂直人群 × 泛选题
“对某一具体人群，以观点/认知/故事为主，易激发共鸣。”
第三象限（右下）：泛人群 × 垂直选题
“借大众关注点切入，提供专业可用视角/工具，具一定普适性。”
第四象限（左下）：泛人群 × 泛选题
“更生活化/人设化表达，弱操作性。”
]

判定流程（务必按序执行）
[
识别人群维度
“垂直人群”判断要点：是否明确到细分职业/阶段/场景/问题。
“泛人群”判断要点：指向广泛、不限定具体职业/阶段或问题。

识别选题维度
“垂直选题”判断要点：是否提供可操作的方法/清单/范式/模板/流程/案例步骤。
“泛选题”判断要点：以认知/观点/故事/洞察为主，操作细节弱。

模糊时的价值类型兜底（仅当上面仍不清晰时使用）：
认知价值 ⇒ 第一象限（更偏方法论且可迁移为动作时，以第一象限为主；若纯观点无步骤，优先第二象限）
情绪价值 ⇒ 第二象限
引导价值（工具/框架/路径）⇒ 第三象限
引流价值（人设、生活方式展示）⇒ 第四象限
]

你得到的输入格式如下
[
【选题】
标题：<title>
灵感来源：<text1>、<text2>（可无）
核心观点：<1-3 句>
内容方向：<预期要展开的方向/模块>
受众价值：<受众能得到的好处>
（可选附加：目标平台/主任务KPI/投放计划）
]

你的输出要求（只输出 JSON，不要额外说明）
严格按下述 JSON Schema 输出（缺失字段用 null 或空数组）
语言：中文
所有打分均给出 1 句理由（字段 reason）
"""

class TopicAnalysisAgent:

    def __init__(self):
        self.module = {
            "llm_client": create_llm_client("deepseek"),
            "llm_model": "deepseek-chat"
        }

    def analyze_topic(self, topic):
        print("Entering analyze_topic...")
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_TOPIC_ANALYSIS},
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
    topic_analysis_agent = TopicAnalysisAgent()
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
    result = topic_analysis_agent.analyze_topic(topic)
    print(result)

if __name__ == "__main__":
    main()