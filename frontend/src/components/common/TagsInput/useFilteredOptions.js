/**
 * useFilteredOptions Hook - 过滤标签选项
 * @param {Array<{tagId: string|number, name: string}>} options - 可选的标签选项列表
 * @param {Array<{tagId: string|number, name: string}>} selectedTags - 已选中的标签列表
 * @param {string} inputValue - 输入框的值
 * @returns {Array<{tagId: string|number, name: string}>} 过滤后的选项列表
 */
export function useFilteredOptions(options, selectedTags, inputValue) {


    return options.filter(option => {
        // 排除已选中的标签
        const isSelected = selectedTags.some(tag => tag.tagId === option.tagId);
        // 匹配输入内容（不区分大小写）
        const matchesInput = option.name.toLowerCase().includes(inputValue.toLowerCase());
        return !isSelected && matchesInput;
    });
}

