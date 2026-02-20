export default function ConfirmDialog({ 
  onConfirm, 
  onCancel,
  title,
  isConfirmed = false
}) {

  return (
    <div className={`
      border rounded-xl p-6 my-2 bg-white border-gray-200 max-w-sm shadow-md
      ${isConfirmed ? 'opacity-60 pointer-events-none' : ''}
    `}>
      {/* 标题 */}
      <h3 className="text-[15px] font-medium text-center text-gray-900 mb-6">
        {title}
      </h3>

      {/* 按钮组 */}
      <div className="flex gap-3 justify-center">
        {/* 确认按钮 */}
        <button
          onClick={onConfirm}
          disabled={isConfirmed}
          className="flex-1 max-w-[160px] py-2.5 px-5 bg-gray-900 text-white text-sm rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 disabled:cursor-not-allowed"
        >
          确认
        </button>

        {/* 取消按钮 */}
        <button
          onClick={onCancel}
          disabled={isConfirmed}
          className="flex-1 max-w-[160px] py-2.5 px-5 bg-white text-gray-900 text-sm border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 disabled:cursor-not-allowed"
        >
          取消
        </button>
      </div>
    </div>
  );
}

