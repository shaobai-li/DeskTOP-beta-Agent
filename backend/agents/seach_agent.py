import os
import json
import faiss
import openai
from sentence_transformers import SentenceTransformer

from dotenv import load_dotenv
load_dotenv()

SYSTEM_PROMPT_CONTENT_TOPIC = """
你是一个内容选题智能体，专门用于分析自媒体文案文本，提取其中的核心信息、趋势洞察和潜在选题灵感。

【输入说明】
你会收到若干个文本切片，每个切片以 <text></text> 标签包裹，内容来自不同自媒体作者的文章或帖子。这些文本通常包含观点、案例、数据、故事或流行话题。

【你的任务】
你的主要目标是从这些文本切片中，**总结出4–5个潜在选题**，并为每个选题提供简要说明。

【输出要求】
请输出一个结构化的选题列表，包含以下信息：

1. 选题标题：一句话总结该选题的核心方向。  
2. 选题灵感来源：指出该选题来自哪些文本切片（可用编号或主题关键词标识）。  
3. 核心观点/洞察：总结文本中的关键观点、趋势或问题。  
4. 潜在内容方向：给出该选题可延展的内容方向、角度或切入点。  
5. 受众价值：说明为什么这个选题可能吸引受众，解决了什么问题或提供了什么价值。

【输出格式示例】
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

【分析与思考要求】
- 你必须基于提供的 <text> 内容生成洞察，**不要编造不存在的信息**。  
- 尽量总结出内容背后的趋势、矛盾点、情绪共鸣或受众痛点。  
- 输出语言应清晰、简洁、有逻辑，适合直接作为选题提案使用。  
- 如果文本内容重复或相似，请进行聚类整合，避免重复选题。  
- 如果信息不足，请合理推测，但明确说明“基于有限信息的推测”。  

【目标】
帮助内容创作者快速从大量文案素材中：
- 提炼潜在趋势与选题；  
- 发现有传播潜力的内容方向；  
- 形成具体可执行的内容选题清单。
"""

def get_llm_client(choice="chatgpt"):
    if choice == "chatgpt":
        return openai.OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY")
            )
    elif choice == "deepseek":
        return openai.OpenAI(
            api_key=os.environ.get("DEEPSEEK_API_KEY"), 
            base_url=os.environ.get("DEEPSEEK_BASE_URL")
            )
    else:
        raise ValueError(f"Undefined model choice '{choice}'")

class SearchAgent:
    
    def __init__(self):
        self.embedding_model = SentenceTransformer('BAAI/bge-large-zh-v1.5')
        self.cg_chunks_index = faiss.read_index("database/cg_chunks_20251014.index")
        with open("database/cg_chunks_20251014.json", "r", encoding="utf-8") as f:
            cg_chunks_json = json.load(f)
        self.id_to_chunk = {c["id"]: c for c in cg_chunks_json}
        self.topic = ""
        self.texts_retrieved = ""
        self.content_framework_module = {
            "llm_client": openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY")),
            "llm_model": "gpt-4o-2024-08-06"
        }

    def local_search(self, queries, k):
        self.topic = queries
        queries_embedded = self.embedding_model.encode([queries])
        _, I = self.cg_chunks_index.search(queries_embedded, k=10)
        
        self.texts_retrieved = ""
        for idx in I[0]:
            self.texts_retrieved += f"<text>{self.id_to_chunk[idx]["text"]}</text>\n\n"

        return self.texts_retrieved

    def content_framework(self, chunks):
        print("Entering content_framework...")
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_CONTENT_TOPIC},
            {"role": "user", "content": f"{self.texts_retrieved}"}
            ]
        print("Sending messages to LLM...")
        response = self.content_framework_module["llm_client"].chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=messages
            )
        print("Received response from LLM...")
        completion = response.choices[0].message.content
        print(completion)
        return completion
