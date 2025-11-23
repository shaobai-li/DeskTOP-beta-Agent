import json
import re

def parse_one_topic(block: str) -> dict:
    # title
    title_match = re.search(r"<title>(.*?)</title>", block, re.S)
    title = title_match.group(1).strip() if title_match else ""

    # subtitle 原始文本
    subtitle_match = re.search(r"<subtitle>(.*?)</subtitle>", block, re.S)
    subtitle_raw = subtitle_match.group(1).strip() if subtitle_match else ""

    subtitle_dict = {}

    return {
        "topic": {
            "title": title,
            "subtitle": subtitle_raw
        }
    }

def parse_topic_list(xml: str):
    topic_blocks = re.findall(r"<topic>(.*?)</topic>", xml, re.S)
    return [parse_one_topic(block) for block in topic_blocks]


def main():
    xml_text = """
<topic_list>
<topic>
<title>【选题1】标题：为什么越来越多年轻人开始反向旅游？</title>
<subtitle>
- 灵感来源：<text 2>, <text 5>  
- 核心观点：年轻人开始避开热门城市，追求冷门目的地的独特体验。  
- 内容方向：探讨反向旅游背后的心理动因、经济因素、社交媒体影响。  
- 受众价值：提供新旅行思路，满足差异化和个性化的出行需求。  
</subtitle>
</topic>

<topic>
<title>【选题2】标题：AI写作会取代自媒体人吗？</title>
<subtitle>
- 灵感来源：<text 1>, <text 4>  
- 核心观点：AI工具带来高效内容生产，但缺乏个性与情绪共鸣。  
- 内容方向：比较AI与人类创作的差异，探讨"创作人格"在内容时代的重要性。  
- 受众价值：帮助创作者思考如何与AI共创而非被替代。  
</subtitle>
</topic>
</topic_list>
""" 

    topics = parse_topic_list(xml_text)
    # 以你想要的 JSON 结构输出
    print(json.dumps(topics, ensure_ascii=False, indent=4))

if __name__ == "__main__":
    main()