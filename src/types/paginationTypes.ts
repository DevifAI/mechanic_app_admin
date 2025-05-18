export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  getPageNumbers: (maxPages?: number) => number[];
  maxPages?: number;
};
