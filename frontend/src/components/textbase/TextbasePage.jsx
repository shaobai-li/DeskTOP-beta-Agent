import './TextbasePage.css';
import { useEffect, useState } from "react";
import TextTable from "./TextTable";
import { getArticles } from "../../services/articlesService";

export default function TextbasePage() {

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
        <div className="textbase-page">
            <div className="textbase-header">
                <h1>我的文本库</h1>
                <p className="textbase-subtitle">管理并查看你的文本资料</p>
            </div>

            <div className="textbase-content">
                <TextTable rows={rows} />
            </div>
        </div>
    )
}