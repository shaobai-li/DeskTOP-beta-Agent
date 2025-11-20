import './TextbaseArticlesPage.css';
import { useEffect, useState } from "react";
import TextTable from "../components/textbase/TextTable";
import Pagination from "../components/layout/Pagination";
import { getArticles } from "../services/articlesService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function TextbaseArticlesPage() {
    const [rows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);

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

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = rows.slice(startIndex, endIndex);

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
                <TextTable rows={currentRows} />
            </div>
            <div className="textbase-article__footer">
                <Pagination
                    totalItems={rows.length}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={setRowsPerPage}
                />
            </div>
        </div>
    )
}