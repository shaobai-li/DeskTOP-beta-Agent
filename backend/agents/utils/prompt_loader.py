import os
from pathlib import Path

def load_prompt(prompt_name: str, prompt_dir: str = None) -> str:
    """
    从 prompts 目录加载提示词文件
    
    Args:
        prompt_name: 提示词文件名（不含扩展名），如 'draft', 'persona'
        prompt_dir: 可选的自定义提示词目录路径（相对于项目根目录），如 'agents/prompts/'
    
    Returns:
        提示词内容字符串
    """
    if prompt_dir:
        # 使用自定义目录（相对于项目根目录）
        project_root = Path(__file__).parent.parent.parent  # backend/
        prompts_dir = project_root / prompt_dir
    else:
        # 默认目录：当前文件所在目录的父级的 prompts 目录
        current_dir = Path(__file__).parent
        prompts_dir = current_dir.parent / "prompts"
    
    prompt_file = prompts_dir / f"{prompt_name}.md"
    
    if not prompt_file.exists():
        raise FileNotFoundError(f"Prompt file not found: {prompt_file}")
    
    with open(prompt_file, "r", encoding="utf-8") as f:
        return f.read().strip()

