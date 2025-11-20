import "./ArticlesTable.css";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

function ArticlesTable({ articles }) {
    const headers = ['文档名称', '日期', '状态'];
    
    return (
        <div className="table-wrapper">
            <table className="simple-table">
                <TableHeader headers={headers} />
                <TableBody data={articles} />
            </table>
        </div>
    );
}

export default ArticlesTable;