import PageSizeSelect from "../textbase/PageSizeSelect";
import "./Pagination.css";

export default function Pagination({
  totalItems,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  const handlePageSizeChange = (newSize) => {
    const newRowsPerPage = parseInt(newSize);
    onRowsPerPageChange(newRowsPerPage);
    // 重新计算当前页，确保不超出范围
    const newTotalPages = Math.ceil(totalItems / newRowsPerPage);
    if (currentPage > newTotalPages) {
      onPageChange(newTotalPages || 1);
    }
  };

  return (
    <div className="pagination">
      <div className="pagination__rowsize">
        <label className="pagination__rowsize__label">每页文本数</label>
        <PageSizeSelect
          options={["20", "40", "60"]}
          defaultValue={rowsPerPage.toString()}
          onValueChange={handlePageSizeChange}
        />
      </div>

      <span className="pagination__pageinfo">
        第 {currentPage} / {totalPages} 页
      </span>

      <div className="pagination__pagebuttons">
        <button onClick={handleFirstPage} disabled={currentPage === 1}>
          «
        </button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          ‹
        </button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          ›
        </button>
        <button onClick={handleLastPage} disabled={currentPage === totalPages}>
          »
        </button>
      </div>
    </div>
  );
}
