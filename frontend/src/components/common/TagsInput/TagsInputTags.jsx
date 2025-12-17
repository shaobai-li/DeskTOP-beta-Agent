import Tag from '../Tag';

/**
 * TagsInputTags 组件 - 标签列表渲染
 * @param {Object} props
 * @param {Array<{tagId: string|number, name: string}>} props.tags - 标签列表
 * @param {function} props.onRemove - 删除标签的回调
 */
export default function TagsInputTags({ tags, onRemove }) {
    return (
        <>
            {tags.map(tag => (
                <Tag
                    key={tag.tagId}
                    text={tag.name}
                    onRemove={() => onRemove(tag.tagId)}
                />
            ))}
        </>
    );
}

