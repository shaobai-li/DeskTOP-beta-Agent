import { useState, useEffect } from 'react';
import DarkBackground from '@components/common/DarkBackground';
import modalCloseIcon from "@assets/icon-ui-modal-close.svg";

export default function TagModal({ isOpen, onClose, onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        originNote: ''
    });

    // 初始化表单数据
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                originNote: initialData.originNote || ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                originNote: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            alert('标签名称不能为空');
            return;
        }
        const tagId = initialData?.tagId || null;
        onSubmit?.(formData, tagId);
        onClose();
    };

    if (!isOpen) return null;  
    return (
        <DarkBackground onClose={onClose}>
    
          {/* 弹窗本体 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[18px] shadow-xl w-full max-w-lg">
              <div className="px-4">
              {/* 标题栏 */}
              <div className="flex items-center justify-between py-4 border-b border-neutral-200">
                <h2 className="text-2xl font-bold">标签设置</h2>
                <button 
                  className="h-9 w-9 rounded-lg bg-transparent hover:bg-neutral-100 flex items-center justify-center"
                  onClick={onClose}
                >
                  <img src={modalCloseIcon} alt="close" className="w-6 h-6" />
                </button>
              </div>
    
              {/* 表单区  */}
              <div className="py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">名称</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-1 border border-neutral-200 rounded-lg text-sm outline-none text-neutral-900"
                    placeholder="请输入标签名称"
                  />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">描述</label>
                  <textarea
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-1 border border-neutral-200 rounded-lg text-sm outline-none text-neutral-900 resize-none"
                    placeholder="请输入标签描述"
                  />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">来源备注</label>
                  <textarea
                    rows={3}
                    name="originNote"
                    value={formData.originNote}
                    onChange={handleChange}
                    className="w-full px-4 py-1 border border-neutral-200 rounded-lg text-sm outline-none text-neutral-900 resize-none"
                    placeholder="请输入来源备注"
                  />
                </div>
              </div>
    
              {/* 按钮区 */}
              <div className="flex justify-end gap-3 py-4 border-t border-neutral-200">
                <button
                  onClick={onClose}
                  className="px-5 py-1 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50"
                >
                  取消
                </button>
                <button 
                  onClick={handleSubmit}
                  className="px-5 py-1 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800"
                >
                  保存
                </button>
              </div>
              </div>
            </div>
          </div>
        </DarkBackground>
      );
    };