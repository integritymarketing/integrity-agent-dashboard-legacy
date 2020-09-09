import React from "react";

const PaginationButton = ({ state = "active", ...props }) => (
  <button
    type="button"
    className={`pagination__button pagination__button--${state}`}
    {...props}
  ></button>
);

const noop = () => null;

const getVisibleRange = (total, current) => {
  const MAX_VISIBLE = 5;
  const numVisible = Math.min(total, MAX_VISIBLE);
  return new Array(numVisible).fill(null).map((_, idx) => {
    if (numVisible < MAX_VISIBLE || current <= Math.ceil(MAX_VISIBLE / 2)) {
      return idx + 1;
    }
    if (current > total - Math.floor(MAX_VISIBLE / 2)) {
      return idx + (total - MAX_VISIBLE + 1);
    }
    return idx + current - Math.floor(MAX_VISIBLE / 2);
  });
};

export default ({
  totalPages = 5,
  currentPage = 1,
  onPageChange = noop,
  ...props
}) => {
  const pages = getVisibleRange(totalPages, currentPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return noop;
    return () => onPageChange(page);
  };

  return (
    <div className="pagination" {...props}>
      <PaginationButton
        state={currentPage === 1 ? "inactive" : "active"}
        onClick={handlePageChange(1)}
      >
        First
      </PaginationButton>
      <PaginationButton
        state={currentPage === 1 ? "inactive" : "active"}
        onClick={handlePageChange(currentPage - 1)}
      >
        Previous
      </PaginationButton>
      <ul className="pagination__pages">
        {pages.map((page) => (
          <li key={page}>
            <PaginationButton
              state={page === currentPage ? "current" : "active"}
              onClick={handlePageChange(page)}
            >
              {page}
            </PaginationButton>
          </li>
        ))}
      </ul>
      <PaginationButton
        state={currentPage === totalPages ? "inactive" : "active"}
        onClick={handlePageChange(currentPage + 1)}
      >
        Next
      </PaginationButton>
      <PaginationButton
        state={currentPage === totalPages ? "inactive" : "active"}
        onClick={handlePageChange(totalPages)}
      >
        Last
      </PaginationButton>
    </div>
  );
};
