import React from "react";
import { PaginationProps } from "../types/paginationTypes";


const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  getPageNumbers,
  maxPages = 4,
}) => (
  <div className="flex justify-center items-center gap-2 mt-4">
    <button
      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
    >
      Prev
    </button>
    {getPageNumbers(maxPages).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1 rounded ${
          currentPage === page
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        }`}
      >
        {page}
      </button>
    ))}
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
