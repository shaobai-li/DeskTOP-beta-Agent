import "./ArticlesTable.css";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

function ArticlesTable({ articles, onDelete }) {
    const headers = ['标题', '日期', '来源平台', '作者', '原平台标签', '标签', '内容'];
    const fields = ['title', 'date', 'sourcePlatform', 'authorName', 'tagsByAuthor', 'tags', 'content'];
    
    return (
        <div className="table-wrapper">
            <table className="simple-table">
                <TableHeader headers={headers} />
                <TableBody data={articles} fields={fields} onDelete={onDelete} />
            </table>
        </div>
    );
}

export default ArticlesTable;