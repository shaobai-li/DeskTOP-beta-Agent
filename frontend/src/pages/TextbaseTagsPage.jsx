import { useEffect, useState } from "react";
import TagTable from "@components/layout/TagTable";
import { getTags } from "@services/tagsService";
import Button from "@components/common/Button";
import TagModal from "@components/layout/TagModal";

export default function TextbaseTagsPage() {

    const [tags, setTags] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        async function loadTags() {
            const { data, error } = await getTags();
            if (error) {
                console.error("加载标签失败：", error);
                return;
            }
            setTags(data);
        }
        loadTags();
    }, []);


    
    const handleAddClick = () => {
        setIsModalOpen(true);
    }

    const handleEditClick = (tagId) => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }
    
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
            />
            <div className="textbase-tags__footer flex px-8"></div>
        </div>
    )
}
