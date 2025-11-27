import os
from pathlib import Path

def load_prompt(prompt_name: str) -> str:
    """
    从 prompts 目录加载提示词文件
    
    Args:
        prompt_name: 提示词文件名（不含扩展名），如 'draft', 'persona'
    
    Returns:
        提示词内容字符串
    """
    # 获取当前文件所在目录
    current_dir = Path(__file__).parent
    # prompts 目录在同一层级
    prompts_dir = current_dir.parent / "prompts"
    prompt_file = prompts_dir / f"{prompt_name}.md"
    
    if not prompt_file.exists():
        raise FileNotFoundError(f"Prompt file not found: {prompt_file}")
    
    with open(prompt_file, "r", encoding="utf-8") as f:
        return f.read().strip()

