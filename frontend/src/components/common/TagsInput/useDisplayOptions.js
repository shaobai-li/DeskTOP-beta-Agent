import { useFilteredOptions } from './useFilteredOptions';

/**
 * useDisplayOptions Hook - 确定要显示的标签选项
 * 根据输入状态决定显示哪些选项：
 * - 初始状态或无匹配时：显示所有可用标签
 * - 有匹配时：显示过滤后的结果
 * 
 * @param {Array<{id: string|number, label: string}>} options - 可选的标签选项列表
 * @param {Array<{id: string|number, label: string}>} selectedTags - 已选中的标签列表
 * @param {string} inputValue - 输入框的值
 * @returns {Array<{id: string|number, label: string}>} 要显示的选项列表
 */
export function useDisplayOptions(options, selectedTags, inputValue) {
    // 获取所有可用标签（排除已选中的）
    const availableOptions = options.filter(option => 
        !selectedTags.some(tag => tag.id === option.id)
    );

    // 使用 Hook 过滤选项
    const filteredOptions = useFilteredOptions(options, selectedTags, inputValue);

    // 确定要显示的选项
    if (!inputValue) {
        // 初始状态：显示所有可用标签
        return availableOptions;
    }
    if (filteredOptions.length === 0) {
        // 无匹配：显示所有可用标签
        return availableOptions;
    }
    // 有匹配：显示过滤后的结果
    return filteredOptions;
}

