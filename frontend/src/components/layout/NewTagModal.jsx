import { useState } from "react";
import DarkBackground from '@components/common/DarkBackground';
import { createTag } from "@services/tagsService";

export default function TagModal({ isOpen, onClose,  onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    origin_note: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    console.log("点击保存了，前端准备发请求");
    if (!form.name.trim()) {
      alert("请填写标签名称");
      return;
    }

    setLoading(true);
    try {
      await createTag({
        name: form.name.trim(),
        description: form.description.trim(),
        origin_note: form.origin_note.trim(),
      });
      onSuccess();        // 告诉父组件刷新列表
      onClose();          // 关弹窗
    } catch (err) {
      alert(err.response?.data?.detail || "保存失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DarkBackground onClose={onClose}>
      <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}   // 加上这行就行！
        >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">

          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-medium text-neutral-900">新增标签</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                名称 <span className="text-red-500"></span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入标签名称"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">描述</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入描述"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">来源备注</label>
              <textarea
                rows={3}
                value={form.origin_note}
                onChange={(e) => setForm({ ...form, origin_note: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入来源备注"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 bg-neutral-50 border-t border-neutral-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 disabled:opacity-50"
            >
              {loading ? "保存中..." : "保存"}
            </button>
          </div>
        </div>
      </div>
    </DarkBackground>
  );
}