import { useEffect, useState } from "react";
import ArticlesTable from "@components/layout/ArticlesTable";
import Pagination from "@components/layout/Pagination";
import { getArticles, createArticle, deleteArticle } from "@services/articlesService";
import Input from "@components/common/Input";
import Button from "@components/common/Button";
import ArticleModal from "@components/layout/ArticleModal";

export default function TextbaseArticlesPage() {
    const [rows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // 处理文章删除
    const handleDeleteArticle = async (articleId) => {
        const { error } = await deleteArticle(articleId);
        if (error) {
            console.error("删除文章失败：", error);
            return;
        }
        console.log("文章删除成功！");
        setRows(prev => prev.filter(row => row.articleId !== articleId));
    };

    // 处理文章提交
    const handleArticleSubmit = async (formData) => {
        console.log("提交的表单数据：", formData);
        
        const { data, error } = await createArticle(formData);
        if (error) {
            console.error("创建文章失败：", error);
            return;
        }
        
        console.log("文章创建成功！", data);
        
        // 创建成功后重新加载文章列表
        const { data: articles, error: loadError } = await getArticles();
        if (!loadError) {
            setRows(articles);
            console.log("文章列表已更新");
        }
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = rows.slice(startIndex, endIndex);

    return (
        <div className="textbase-articles">
            <div className="textbase-articles__header flex justify-between px-8 py-2">
                <Input 
                    value={searchValue}
                    onChange={handleSearchChange}
                />
                <Button onClick={handleAddClick} text="添加" />
            </div>
            <div className="textbase-article__content flex flex-col px-8">
                <ArticlesTable articles={currentRows} onDelete={handleDeleteArticle} />
            </div>
            <div className="textbase-article__footer flex px-8 justify-end">
                <Pagination
                    totalItems={rows.length}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={setRowsPerPage}
                />
            </div>
            <ArticleModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleArticleSubmit}
            />
        </div>
    )
}