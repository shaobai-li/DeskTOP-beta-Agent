import closeIcon from '@assets/icon-ui-chatinput-close.svg';

/**
 * Tag 组件 - 显示单个标签
 * @param {Object} props
 * @param {string} props.text - 标签文本
 * @param {function} [props.onRemove] - 删除回调
 * @param {string} [props.className] - 自定义类名
 */
export default function Tag({ text, onRemove, className = '' }) {
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-700 text-sm rounded-md ${className}`}
        >
            <span className="max-w-[120px] truncate">{text}</span>
            {onRemove && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="flex items-center justify-center w-4 h-4 hover:bg-neutral-200 rounded transition-colors"
                >
                    <img
                        src={closeIcon}
                        alt="删除"
                        className="w-3 h-3 opacity-50 hover:opacity-80 brightness-0"
                    />
                </button>
            )}
        </span>
    );
}

