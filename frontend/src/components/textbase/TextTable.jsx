import { useState } from "react";
import "./TextTable.css";

function TextTable({ rows }) {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>文档名称</th>
            <th>日期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="empty-cell">
                暂无数据
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{r.date}</td>
                <td>{r.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage}>
            &lt;
        </button>
        
        <span>
            页码 {currentPage} / {totalPages}
        </span>

        <button onClick={handleNextPage}>
            &gt;
        </button>
      </div>
    </div>
  );
}

export default TextTable;