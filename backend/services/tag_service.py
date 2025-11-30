from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Optional
from datetime import datetime
from models.tag import Tag
from utils import to_camel_case, uuid7


class TagService:
    """标签业务逻辑服务层"""

    @staticmethod
    async def get_all_tags(db: AsyncSession) -> List[Dict]:
        """获取所有标签"""
        result = await db.execute(select(Tag).order_by(Tag.created_at.desc()))
        tags = result.scalars().all()
        return to_camel_case([tag.to_dict() for tag in tags])

    @staticmethod
    async def create_tag(name: str, description: str = "", origin_note: str = "", db: AsyncSession = None) -> Dict:
        """创建新标签"""
        name = name.strip()
        if not name:
            raise ValueError("标签名不能为空")

        # 检查重复（不区分大小写）
        result = await db.execute(
            select(Tag).where(Tag.name.ilike(name))
        )
        if result.scalar_one_or_none():
            raise ValueError("标签名已存在")

        new_tag = Tag(
            tag_id=uuid7(),
            name=name,
            description=description.strip(),
            origin_note=origin_note.strip(),
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        db.add(new_tag)
        await db.commit()
        await db.refresh(new_tag)
        return to_camel_case([new_tag.to_dict()])[0]

    @staticmethod
    async def update_tag(tag_id: str, name: Optional[str] = None, description: Optional[str] = None,
                        origin_note: Optional[str] = None, db: AsyncSession = None) -> Dict:
        """更新标签"""
        tag = await db.get(Tag, tag_id)
        if not tag:
            raise ValueError(f"标签 {tag_id} 不存在")

        # 直接判断每个字段是否传入（不为 None）
        if name is not None:
            new_name = name.strip()
            if not new_name:
                raise ValueError("标签名不能为空")
            if new_name.lower() != tag.name.lower():
                result = await db.execute(
                    select(Tag).where(Tag.name.ilike(new_name), Tag.tag_id != tag_id)
                )
                if result.scalar_one_or_none():
                    raise ValueError("标签名已存在")
            tag.name = new_name

        if description is not None:
            tag.description = description.strip()

        if origin_note is not None:
            tag.origin_note = origin_note.strip()

        await db.commit()
        await db.refresh(tag)
        return to_camel_case([tag.to_dict()])[0]

    @staticmethod
    async def delete_tag(tag_id: str, db: AsyncSession = None) -> Dict:
        """删除标签"""
        tag = await db.get(Tag, tag_id)
        if not tag:
            raise ValueError(f"标签 {tag_id} 不存在")

        tag_dict = tag.to_dict()
        await db.delete(tag)
        await db.commit()
        return to_camel_case([tag_dict])[0]

