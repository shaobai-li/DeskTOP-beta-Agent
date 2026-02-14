import { useEffect, useState } from "react";
import ArticlesTable from "@components/layout/ArticlesTable";
import Pagination from "@components/layout/Pagination";
import { getArticles, createArticle, updateArticle, deleteArticle, updateArticleTags } from "@services/articlesService";
import Input from "@components/common/Input";
import Button from "@components/common/Button";
import ArticleModal from "@components/layout/ArticleModal";

export default function TextbaseArticlesPage() {
    const [rows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);  // 新增：存储正在编辑的文章

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchValue);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchValue]);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleAddClick = () => {
        setEditingArticle(null);  // 清空编辑状态
        setIsModalOpen(true);
    };

    // 新增：处理编辑按钮点击
    const handleEditArticle = (article) => {
        setEditingArticle(article);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingArticle(null);  // 关闭时清空编辑状态
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

    // 修改：处理文章提交（新建或更新）
    const handleArticleSubmit = async (formData, articleId, tagIds = []) => {
        let finalArticleId = articleId;
        
        if (articleId) {
            // 编辑模式
            const { data, error } = await updateArticle(articleId, formData);
            if (error) {
                console.error("更新文章失败：", error);
                return;
            }
            console.log("文章更新成功！", data);
        } else {
            // 新建模式
            const { data, error } = await createArticle(formData);
            if (error) {
                console.error("创建文章失败：", error);
                return;
            }
            console.log("文章创建成功！", data);
            // 获取新创建的文章ID
            finalArticleId = data.articleId;
        }
        
        // 更新文章标签
        if (finalArticleId && tagIds) {
            const { error: tagsError } = await updateArticleTags(finalArticleId, tagIds);
            if (tagsError) {
                console.error("更新文章标签失败：", tagsError);
                // 即使标签更新失败，也继续重新加载文章列表
            } else {
                console.log("文章标签更新成功！");
            }
        }
        
        // 重新加载文章列表
        const { data: articles, error: loadError } = await getArticles();
        if (!loadError) {
            setRows(articles);
        }
    };

    const filteredRows = debouncedSearch
        ? rows.filter(row =>
            row.title?.includes(debouncedSearch) ||
            row.authorName?.includes(debouncedSearch) ||
            row.tagsByAuthor?.includes(debouncedSearch) ||
            row.tags?.includes(debouncedSearch) ||
            row.content?.includes(debouncedSearch)
        )
        : rows;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = filteredRows.slice(startIndex, endIndex);

    return (
        <div className="textbase-articles h-full flex-col overflow-y-auto">
            <div className="textbase-articles__header flex justify-between px-8 py-2">
                <Input 
                    value={searchValue}
                    onChange={handleSearchChange}
                />
                <div className="flex gap-2">
                    <Button onClick={handleAddClick} text="添加" />
                </div>
            </div>
            <div className="textbase-article__content flex flex-col px-8">
                <ArticlesTable 
                    articles={currentRows} 
                    onDelete={handleDeleteArticle}
                    onEdit={handleEditArticle}  // 新增
                />
            </div>
            <div className="textbase-article__footer flex px-8 justify-end">
                <Pagination
                    totalItems={filteredRows.length}
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
                initialData={editingArticle}  // 新增：传递编辑数据
            />
        </div>
    )
}