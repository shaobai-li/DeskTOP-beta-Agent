import { useEffect, useState } from "react";
import TagTable from "@components/layout/TagTable";
import { getTags } from "@services/tagsService";
import Button from "@components/common/Button";
import TagModal from "@components/layout/NewTagModal";

export default function TextbaseTagsPage() {
    const [tags, setTags] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadTags = async () => {
        const { data, error } = await getTags();
        if (!error) setTags(data || []);
    };

    useEffect(() => {
        loadTags();
    }, []);

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // 保存成功后刷新列表

    const handleSuccess = () => {
        loadTags();
    };

    return (
        <div className="textbase-tags">
            <div className="textbase-tags__header flex justify-end px-8 py-2">
                <Button text="添加" onClick={handleAddClick} />
            </div>

            <div className="textbase-tags__content flex flex-col px-8">
                <TagTable tags={tags} />
            </div>

            <TagModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}   
            />

            <div className="textbase-tags__footer flex px-8"></div>
        </div>
    );
}