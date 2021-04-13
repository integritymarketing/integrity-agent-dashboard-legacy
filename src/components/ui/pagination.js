import React from "react";
import Media from "react-media";
import Next from "components/icons/next"

const PaginationButton = ({ state = "active", children, ...props }) => (
  <li className={`pagination__button pagination__button--${state}`} {...props}>
    <button
      type="button"
      aria-disabled={state === "inactive" ? true : undefined}
      aria-current={state === "current" ? "page" : undefined}
    >
      {children}
    </button>
  </li>
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
  totalResults,
  currentPage = 1,
  pageSize = 12,
  onPageChange = noop,
  ...props
}) => {
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return noop;
    return () => onPageChange(page);
  };

  const showingFrom = currentPage === 1 ? currentPage : ((currentPage - 1) * pageSize) + 1;
  const showingTo = currentPage === 1 ? pageSize : (currentPage * pageSize) > totalResults ? totalResults : currentPage * pageSize;

  return (
    <Media
      queries={{
        large: "(min-width: 768px)",
      }}
    >
      {(matches) => (matches.large &&
        <div className="pagination-container">
          <div className="pagination-display-results">
            {`Showing ${showingFrom} - ${showingTo} of ${totalResults} contacts`}
          </div>
          <nav
            aria-label="pagination"
            className={`pagination ${matches.large ? "" : "pagination--mini"}`}
            {...props}
          >
            <ul className="pagination__pages">
              {getVisibleRange(
                totalPages,
                currentPage,
                5
              ).map((page) => (
                <PaginationButton
                  key={page}
                  state={page === currentPage ? "current" : "active"}
                  onClick={handlePageChange(page)}
                >
                  <span className="visuallyhidden">page </span> {page}
                </PaginationButton>
              ))}

              <PaginationButton
                state={currentPage === totalPages ? "inactive" : "active"}
                onClick={handlePageChange(currentPage + 1)}
              >
                <span className="mr-1">Next</span> <Next /> <span className="visuallyhidden">page</span>
              </PaginationButton>
              {matches.large && (
                <PaginationButton
                  state={currentPage === totalPages ? "inactive" : "active"}
                  onClick={handlePageChange(totalPages)}
                >
                  Last <span className="visuallyhidden">page</span>
                </PaginationButton>
              )}
            </ul>
          </nav>
        </div>
      )}
    </Media>
  );
};
