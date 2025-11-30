import { useState } from "react";
import DarkBackground from '@components/common/DarkBackground';

export default function ArticleModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    source_platform: "小红书",  
    author_name: "",            
    tags_by_author: "",
    content: ""         
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSubmit?.(formData);
    onClose();
  };

  return (
    <DarkBackground onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-medium">文章设置</h2>
            <button onClick={onClose}>✕</button>
          </div>

          <div className="p-6 space-y-6">

            <h3 className="font-semibold">基本信息</h3>

            <div>
              <label>标题</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="请输入文章标题"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label>发布时间</label>
              <input
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="2024-11-27"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <h3 className="font-semibold">来源信息</h3>

            <div>
              <label>来源平台</label>
              <input
                name="source_platform"
                value={formData.source_platform}
                onChange={handleChange}
                placeholder="小红书"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label>作者名称</label>
              <input
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                placeholder="作者昵称"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label>原平台标签</label>
              <input
                name="tags_by_author"
                value={formData.tags_by_author}
                onChange={handleChange}
                placeholder="#旅行 #穿搭"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <h3 className="font-semibold">文章内容</h3>

            <div>
              <label>内容</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="请输入文章内容..."
                rows={6}
                className="w-full px-3 py-2 border rounded-md resize-y"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t">
            <button onClick={onClose} className="border px-4 py-2 rounded">
              取消
            </button>
            <button
              onClick={handleSave}
              className="bg-black text-white px-4 py-2 rounded"
            >
              保存
            </button>
          </div>

        </div>
      </div>
    </DarkBackground>
  );
}