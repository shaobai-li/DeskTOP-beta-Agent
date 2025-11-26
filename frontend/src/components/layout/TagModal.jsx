import DarkBackground from '@components/common/DarkBackground';

export default function TagModal({ isOpen, onClose }) {
    if (!isOpen) return null;  
    return (
        <DarkBackground onClose={onClose}>
    
          {/* 弹窗本体 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
    
              {/* 标题栏 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                <h2 className="text-lg font-medium text-neutral-900">标签设置</h2>
                <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
    
              {/* 表单区  */}
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">名称</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400"
                    placeholder=""
                  />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">描述</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400"
                    placeholder=""
                  />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">来源备注</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400"
                  />
                </div>
              </div>
    
              {/* 按钮区 */}
              <div className="flex justify-end gap-3 px-6 py-4 bg-neutral-50 border-t border-neutral-200">
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50"
                >
                  取消
                </button>
                <button className="px-5 py-2 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800">
                  保存
                </button>
              </div>
            </div>
          </div>
        </DarkBackground>
      );
    };