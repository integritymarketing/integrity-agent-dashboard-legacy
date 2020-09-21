import React from "react";
import Media from "react-media";

const PaginationButton = ({ state = "active", ...props }) => (
  <button
    type="button"
    className={`pagination__button pagination__button--${state}`}
    {...props}
  ></button>
);

const noop = () => null;

const getVisibleRange = (total, current, maxVisible = 5) => {
  const numVisible = Math.min(total, maxVisible);
  return new Array(numVisible).fill(null).map((_, idx) => {
    if (numVisible < maxVisible || current <= Math.ceil(maxVisible / 2)) {
      return idx + 1;
    }
    if (current > total - Math.floor(maxVisible / 2)) {
      return idx + (total - maxVisible + 1);
    }
    return idx + current - Math.floor(maxVisible / 2);
  });
};

export default ({
  totalPages = 5,
  currentPage = 1,
  onPageChange = noop,
  ...props
}) => {
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return noop;
    return () => onPageChange(page);
  };

  return (
    <Media
      queries={{
        large: "(min-width: 768px)",
      }}
    >
      {(matches) => (
        <div
          className={`pagination ${matches.large ? "" : "pagination--mini"}`}
          {...props}
        >
          {matches.large && (
            <PaginationButton
              state={currentPage === 1 ? "inactive" : "active"}
              onClick={handlePageChange(1)}
            >
              First
            </PaginationButton>
          )}
          <PaginationButton
            state={currentPage === 1 ? "inactive" : "active"}
            onClick={handlePageChange(currentPage - 1)}
          >
            Previous
          </PaginationButton>
          <ul className="pagination__pages">
            {getVisibleRange(
              totalPages,
              currentPage,
              matches.large ? 5 : 3
            ).map((page) => (
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
          {matches.large && (
            <PaginationButton
              state={currentPage === totalPages ? "inactive" : "active"}
              onClick={handlePageChange(totalPages)}
            >
              Last
            </PaginationButton>
          )}
        </div>
      )}
    </Media>
  );
};
