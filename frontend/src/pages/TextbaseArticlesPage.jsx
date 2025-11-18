import './TextbasePage.css';
import { useEffect, useState } from "react";
import TextTable from "../components/textbase/TextTable";
import { getArticles } from "../services/articlesService";

export default function TextbaseArticlesPage() {

    const [rows, setRows] = useState([]);

    useEffect(() => {
        async function loadArticles() {
            const { data, error } = await getArticles();
            if (error) {
                console.error("加载文章失败：", error);
                return;
            }
            setRows(data);
        }
        loadArticles();
    }, []);

    return (
        <div className="textbase-articles">
            <div className="textbase-articles__header">
            </div>
            <div className="textbase-article__content">
                <TextTable rows={rows} />
            </div>
            <div className="textbase-article__footer">
            </div>
        </div>
    )
}