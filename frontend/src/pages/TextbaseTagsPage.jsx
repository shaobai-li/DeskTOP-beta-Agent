import { useEffect, useState } from "react";
import TagTable from "@components/layout/TagTable";
import { getTags, deleteTag, createTag, updateTag } from "@services/tagsService";
import Button from "@components/common/Button";
import TagModal from "@components/layout/TagModal";
import { useChat } from "@contexts/ChatContext";

export default function TextbaseTagsPage() {
    const { state, actions } = useChat();
    const [searchValue, setSearchValue] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    useEffect(() => {
    }, []);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleAddClick = () => {
        setEditingTag(null);  // 清空编辑状态
        setIsModalOpen(true);
    };

    const handleTagSubmit = async (formData, tagId) => {
        try {
            // 转换字段名以匹配后端API
            const tagData = {
                name: formData.name,
                description: formData.description || '',
                origin_note: formData.originNote || ''
            };
            
            if (tagId) {
                // 编辑模式
                const { error } = await updateTag(tagId, tagData);
                if (error) {
                    console.error("更新标签失败：", error);
                    return;
                }
                console.log("标签更新成功！");
            } else {
                // 新建模式
                const { error } = await createTag(tagData);
                if (error) {
                    console.error("创建标签失败：", error);
                    return;
                }
                console.log("标签创建成功！");
            }
            
            // 重新加载标签列表
            await actions.loadTags();
        } catch (error) {
            console.error("处理标签提交失败：", error);
        }
    };

    const handleDeleteTag = async (tagId) => {
        if (window.confirm('确定要删除这个标签吗？')) {
            const { error } = await deleteTag(tagId);
            if (error) {
                console.error("删除标签失败：", error);
                return;
            }
            console.log("标签删除成功！");
            await actions.loadTags();
        }
    };

    const handleEditTag = (tag) => {
        setEditingTag(tag);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTag(null);  // 关闭时清空编辑状态
    };

    return (
        <div className="textbase-tags">
            <div className="textbase-tags__header flex justify-between items-center px-8 py-4">
                <div></div>
                <div className="flex gap-2">
                    <Button onClick={handleAddClick} text="添加" />
                </div>
            </div>
            <div className="textbase-tags__content flex flex-col px-8">
                <TagTable 
                    tags={state.tags} 
                    onDelete={handleDeleteTag}
                    onEdit={handleEditTag}
                />
            </div>
            <TagModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleTagSubmit}
                initialData={editingTag}
            />
        </div>
    );
}