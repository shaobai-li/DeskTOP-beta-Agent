import { useState, useRef, useEffect } from 'react';
import { useDisplayOptions } from './useDisplayOptions';
import TagsInputDropdown from './TagsInputDropdown';
import TagsInputTags from './TagsInputTags';

/**
 * TagsInput 组件 - 带下拉菜单的标签输入框
 * @param {Object} props
 * @param {Array<{tagId: string|number, name: string}>} props.options - 可选的标签选项列表
 * @param {Array<{tagId: string|number, name: string}>} props.value - 已选中的标签列表
 * @param {function} props.onChange - 选中标签变化时的回调，参数为新的标签列表
 */
export default function TagsInput({
    options = [],
    value = [],
    onChange,
}) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // 使用 Hook 确定要显示的选项
    const displayOptions = useDisplayOptions(options, value, inputValue);

    
    // 点击外部关闭下拉菜单和编辑模式
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setIsEditing(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    
    // 进入编辑模式
    const handleStartEditing = () => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    // 添加标签
    const handleSelectOption = (option) => {
        onChange([...value, option]);
        setInputValue('');
        setIsOpen(false);
        inputRef.current?.focus();
    };

    // 删除标签
    const handleRemoveTag = (tagId) => {
        onChange(value.filter(tag => tag.tagId !== tagId));
    };

    
    return (
        <div ref={containerRef} className="relative">
            {/* 输入区域 */}
            <div
                className={`flex flex-wrap items-center gap-1.5 p-2 min-h-[42px] rounded-lg ${
                    isEditing 
                        ? 'border border-neutral-400 bg-white' 
                        : 'border border-transparent bg-transparent'
                }`}
                onClick={() => {
                    if (value.length > 0 && !isEditing) {
                        handleStartEditing();
                    }
                }}
            >
                {/* 无标签时显示占位标签 */}
                {value.length === 0 && !isEditing && (
                    <span
                        onClick={handleStartEditing}
                        className="inline-flex items-center px-2 py-0.5 bg-neutral-100 text-neutral-400 text-sm rounded-md cursor-pointer hover:bg-neutral-200"
                    >
                        添加标签
                    </span>
                )}

                {/* 已选标签 */}
                <TagsInputTags tags={value} onRemove={handleRemoveTag} />

                {/* 输入框 - 仅在编辑模式显示 */}
                {isEditing && (
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        className="flex-1 outline-none min-w-[20px] text-sm text-neutral-900 bg-transparent"
                    />
                )}
            </div>

            {/* 下拉菜单 */}
            <TagsInputDropdown
                options={displayOptions}
                onSelect={handleSelectOption}
                isOpen={isOpen && (isEditing || inputValue) && displayOptions.length > 0}
            />
        </div>
    );
}

