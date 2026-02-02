import { useState, useEffect } from "react";
import DarkBackground from '@components/common/DarkBackground';
import TagsInput from "@components/common/TagsInput";
import { useChat } from "@contexts/ChatContext";
import modalCloseIcon from "@assets/icon-ui-modal-close.svg";

export default function ArticleModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const { state } = useChat();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    source_platform: "小红书",  
    author_name: "",            
    tags_by_author: "",
    content: ""         
  });
  const [selectedTags, setSelectedTags] = useState([]);

  // 转换后端标签数据为 TagsInput 需要的格式  
  const tagOptions = state.tags.map(tag => ({
    tagId: tag.tagId,
    name: tag.name
  }));

  // 当 initialData 变化时，更新表单数据
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        date: initialData.date || "",
        source_platform: initialData.sourcePlatform || "小红书",
        author_name: initialData.authorName || "",
        tags_by_author: initialData.tagsByAuthor || "",
        content: initialData.content || ""
      });
      // 加载文章的标签（从 tagsInfo 字段读取）
      if (initialData.tagsInfo && Array.isArray(initialData.tagsInfo)) {
        const tags = initialData.tagsInfo.map(tag => ({
          tagId: tag.tagId,
          name: tag.name
        }));
        setSelectedTags(tags);
      } else {
        setSelectedTags([]);
      }
    } else {
      // 重置表单
      setFormData({
        title: "",
        date: "",
        source_platform: "小红书",
        author_name: "",
        tags_by_author: "",
        content: ""
      });
      setSelectedTags([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const tagIds = selectedTags.map(tag => tag.tagId).filter(Boolean);
    onSubmit?.(formData, initialData?.articleId, tagIds);  // 传递 articleId 和 tagIds
    onClose();
  };

  const isEditMode = !!initialData;

  return (
    <DarkBackground onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[18px] shadow-xl w-full max-w-lg overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
          <div className="px-4">
          <div className="flex items-center justify-between py-4 border-b border-neutral-200">
            <h2 className="text-2xl font-bold">文章设置</h2>
            <button 
              className="h-9 w-9 rounded-lg bg-transparent hover:bg-neutral-100 flex items-center justify-center"
              onClick={onClose}
            >
              <img src={modalCloseIcon} alt="close" className="w-6 h-6" />
            </button>
          </div>

          <div className="py-4 space-y-4">

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-neutral-700">链接</label>
                <button 
                  className="px-3 py-1 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800"
                >
                  识别url
                </button>
              </div>
              <input
                className="w-full px-4 py-1 border border-neutral-200 rounded-lg text-sm outline-none text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">标题</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="请输入文章标题"
                className="w-full px-4 py-1 border border-neutral-200 rounded-lg text-sm outline-none text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">发布时间</label>
              <input
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="2024-11-27"
                className="w-full px-4 py-1 border border-neutral-200 rounded-lg text-sm outline-none text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">来源平台</label>
              <input
                name="source_platform"
                value={formData.source_platform}
                onChange={handleChange}
                placeholder="小红书"
                className="w-full px-4 py-1 border border-neutral-200 rounded-lg text-sm outline-none text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">作者名称</label>
              <input
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                placeholder="作者昵称"
                className="w-full px-4 py-1 border border-neutral-200 rounded-lg text-sm outline-none text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">原平台标签</label>
              <input
                name="tags_by_author"
                value={formData.tags_by_author}
                onChange={handleChange}
                placeholder="#旅行 #穿搭"
                className="w-full px-4 py-1 border border-neutral-200 rounded-lg text-sm outline-none text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">内容</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="请输入文章内容..."
                rows={6}
                className="w-full px-4 py-1 border border-neutral-200 rounded-lg text-sm outline-none text-neutral-900 resize-y"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">标签</label>
              <TagsInput
                options={tagOptions}
                value={selectedTags}
                onChange={setSelectedTags}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 py-4 border-t border-neutral-200">
            <button onClick={onClose} className="px-5 py-1 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50">
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-1 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800"
            >
              {isEditMode ? '更新' : '保存'}
            </button>
          </div>
          </div>
          </div>
        </div>
      </div>
    </DarkBackground>
  );
}