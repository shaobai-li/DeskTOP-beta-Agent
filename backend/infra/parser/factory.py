from typing import Optional
from .xiaohongshu import XiaohongshuParser
from .base import PlatformParser

def get_parser(url: str) -> Optional[PlatformParser]:
    if "xiaohongshu.com" in url:
        return XiaohongshuParser()
    return None
