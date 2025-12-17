/**
 * TagsInputDropdown 组件 - 标签输入框的下拉菜单
 * @param {Object} props
 * @param {Array<{tagId: string|number, name: string}>} props.options - 下拉选项列表
 * @param {function} props.onSelect - 选择选项的回调
 * @param {boolean} props.isOpen - 是否显示下拉菜单
 */
export default function TagsInputDropdown({ options, onSelect, isOpen }) {
    if (!isOpen || options.length === 0) {
        return null;
    }

    return (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
            <ul className="max-h-[100px] overflow-y-auto py-1">
                {options.map((option) => (
                    <li
                        key={option.tagId}
                        onClick={() => onSelect(option)}
                        className="px-3 py-2 text-sm cursor-pointer transition-colors text-neutral-700 hover:bg-neutral-50"
                    >
                        {option.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

