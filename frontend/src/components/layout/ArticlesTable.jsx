import "./ArticlesTable.css";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

function ArticlesTable({ articles, onDelete }) {
    const headers = ['标题', '日期', '来源平台', '作者', '标签'];
    const fields = ['title', 'date', 'sourcePlatform', 'authorName', 'tagsByAuthor'];
    
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