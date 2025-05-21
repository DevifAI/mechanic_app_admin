import React from "react";
import { PaginationProps } from "../types/paginationTypes";

const rowsPerPageOptions = [10, 25, 50, 100, 200];

const Pagination: React.FC<PaginationProps & {
  rowsPerPage: number;
  setRowsPerPage: (n: number) => void;
}> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
}) => (
  <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
    <div className="flex items-center gap-2">
      {/* <span>Rows per page:</span> */}
      <select
        value={rowsPerPage}
        onChange={e => setRowsPerPage(Number(e.target.value))}
        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
      >
        {rowsPerPageOptions.map(opt => (
          <option key={opt} value={opt}>{opt} per page</option>
        ))}
      </select>
    </div>
    <button
      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
    >
      Prev
    </button>
    <span className="flex items-center gap-1">
      <span>Page</span>
      <select
        value={currentPage}
        onChange={e => setCurrentPage(Number(e.target.value))}
        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <option key={page} value={page}>
            {page}
          </option>
        ))}
      </select>
      <span>of {totalPages}</span>
    </span>
    <button
      onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

export default Pagination;