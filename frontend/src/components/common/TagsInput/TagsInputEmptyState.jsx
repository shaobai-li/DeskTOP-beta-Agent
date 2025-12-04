/**
 * TagsInputEmptyState 组件 - 无匹配结果提示
 * @param {boolean} props.show - 是否显示
 */
export default function TagsInputEmptyState({ show }) {
    if (!show) {
        return null;
    }

    return (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
            <div className="px-3 py-3 text-sm text-neutral-400 text-center">
                没有匹配的标签
            </div>
        </div>
    );
}

