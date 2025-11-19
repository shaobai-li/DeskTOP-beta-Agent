import './TextbaseArticlesPage.css';
import { useEffect, useState } from "react";
import TextTable from "../components/textbase/TextTable";
import { getArticles } from "../services/articlesService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";


export default function TextbaseArticlesPage() {

    const [rows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState("")

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

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleAddClick = () => {
    };

    return (
        <div className="textbase-articles">
            <div className="textbase-articles__header">
                <Input 
                    value={searchValue}
                    onChange={handleSearchChange}
                />
                <Button onClick={handleAddClick} text="添加" />
            </div>
            <div className="textbase-article__content">
                <TextTable rows={rows} />
            </div>
            <div className="textbase-article__footer">
                
            </div>
        </div>
    )
}