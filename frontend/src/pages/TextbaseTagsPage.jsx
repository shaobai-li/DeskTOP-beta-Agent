import { useEffect, useState } from "react";
import TagTable from "@components/layout/TagTable";
import { getTags } from "@services/tagsService";

export default function TextbaseTagsPage() {

    const [tags, setTags] = useState([]);

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

    return (
        <div className="textbase-tags">
            <div className="textbase-tags__header"></div>
            <div className="textbase-tags__content">
                <TagTable tags={tags} />
            </div>
            <div className="textbase-tags__footer"></div>
        </div>
    )
}
