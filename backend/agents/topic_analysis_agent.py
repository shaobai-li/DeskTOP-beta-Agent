from agents.utils.llm_client import create_llm_client
from agents.utils.xml_parser import parse_topic_list, build_topic_xml
from agents.utils.text_cleaner import clean_json_tags
from agents.utils.prompt_loader import load_prompt

SYSTEM_PROMPT_TOPIC_ANALYSIS = load_prompt("topic_analysis")

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
        return completion

    def analyze_topic_list(self, xml_topic_list):
        print("Starting to analyze topic list...")
        topics = parse_topic_list(xml_topic_list)
        print(f"Found {len(topics)} topics to analyze...")
        for i, topic in enumerate(topics):
            print(f"Analyzing topic: {i+1}/{len(topics)}")
            result = self.analyze_topic(topic)
            result = clean_json_tags(result)
            topic["topic"]["subtitle"] = '\n'.join([topic["topic"]["subtitle"], result])
            print(topic["topic"]["subtitle"])
            xml_topic = build_topic_xml(topic)
            yield xml_topic

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