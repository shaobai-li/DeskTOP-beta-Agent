import { useState } from "react";
import PageSizeSelect from "./PageSizeSelect";
import UploadButton from "./UploadButton";
import "./TextTable.css";

export default function TextTable({ rows }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = rows.slice(startIndex, endIndex);

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

    const handleFirstPage = () => {
      setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    // 每页行数选择功能
    const handlePageSizeChange = (newSize) => {
      const newRowsPerPage = parseInt(newSize);
      setRowsPerPage(newRowsPerPage);
      // 重新计算当前页，确保不超出范围
      const newTotalPages = Math.ceil(rows.length / newRowsPerPage);
      if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
      }
    };  

    const handleFileSelect = (file) => {
        console.log(file);
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
            currentRows.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{r.date}</td>
                <td>{r.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="upload-pagination-container">
        <div className="upload">
          <UploadButton onFileSelect={handleFileSelect} accept=".doc" multiple={false} />
        </div>

        <div className="pagination">
          <div className="pagination__rowsize">
            <label className="pagination__rowsize__label">每页文本数</label>
            <PageSizeSelect
              options={["20", "40", "60"]}
              defaultValue="20"
              onValueChange={handlePageSizeChange}
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
    </div>
  );
}