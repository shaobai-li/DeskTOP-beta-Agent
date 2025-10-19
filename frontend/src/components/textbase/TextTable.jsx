import { useState } from "react";
import PageSizeSelect from "./PageSizeSelect";
import "./TextTable.css";

export default function TextTable({ rows }) {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;
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
        <div className="pagination__rowsize">
          <label className="pagination__rowsize__label">每页文本数</label>
          <PageSizeSelect
            options={["20", "40", "60"]}
            defaultValue="20"
          />
        </div>

        <span className="pagination__pageinfo">
          第 {currentPage} / {totalPages} 页
        </span>

        <div className="pagination__pagebuttons">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            «
          </button>
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            ‹
          </button>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            ›
          </button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
            »
          </button>
        </div>


      </div>
    </div>
  );
}