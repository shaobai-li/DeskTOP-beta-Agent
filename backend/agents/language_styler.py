from utils.llm_client import create_llm_client
from utils.prompt_loader import load_prompt


SYSTEM_PROMPT = load_prompt("styling")

class LanguageStyler:
    def __init__(self):
        self.module = {
            'llm_client': create_llm_client("deepseek"),
            'llm_model' : "deepseek-chat"
        }

    def styler(self, topic: str):
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
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