import React from "react";
import Media from "react-media";
import Next from "components/icons/next";
import Previous from "components/icons/previous";
import "./pagination.scss";

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
  resultName = "contacts",
  onPageChange = noop,
  providerPagination = false,
  contactsCardPage = false,
  ...props
}) => {
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return noop;
    return () => onPageChange(page);
  };

  const showingFrom = (currentPage - 1) * pageSize + 1;
  const showingTo =
    currentPage * pageSize > totalResults
      ? totalResults
      : currentPage * pageSize;

  return (
    <Media
      queries={{
        large: "(min-width: 768px)",
      }}
    >
      {(matches) =>
        ((!matches.large && (providerPagination || contactsCardPage)) ||
          matches.large) && (
          <div className="pagination-container">
            {!providerPagination && (
              <div className="pagination-display-results">
                {`Showing ${showingFrom} - ${showingTo} of ${totalResults} ${resultName}`}
              </div>
            )}
            {totalPages > 1 ? (
              <nav
                aria-label="pagination"
                className={`pagination ${
                  matches.large ? "" : "pagination--mini"
                }`}
                {...props}
              >
                <ul
                  className={`pagination__pages ${
                    providerPagination ? "provider-pagination-ul" : ""
                  }`}
                >
                  {currentPage !== 1 && matches.large && !providerPagination && (
                    <div className="mr-1 first">
                      <PaginationButton
                        state={currentPage === 1 ? "inactive" : "active"}
                        onClick={handlePageChange(1)}
                      >
                        First <span className="visuallyhidden">page</span>
                      </PaginationButton>
                    </div>
                  )}
                  <div className="pagination__middle">
                    {currentPage !== 1 && matches.large && (
                      <PaginationButton
                        state={currentPage === 1 ? "inactive" : "active"}
                        onClick={handlePageChange(currentPage - 1)}
                      >
                        <span className="mr-1">
                          <Previous />
                        </span>
                        {!providerPagination && <>Prev</>}{" "}
                        <span className="visuallyhidden">page</span>
                      </PaginationButton>
                    )}
                    {getVisibleRange(totalPages, currentPage, 5).map((page) => (
                      <PaginationButton
                        key={page}
                        state={page === currentPage ? "current" : "active"}
                        onClick={handlePageChange(page)}
                      >
                        <span className="visuallyhidden">page </span> {page}
                      </PaginationButton>
                    ))}
                    {currentPage !== totalPages && matches.large && (
                      <PaginationButton
                        state={
                          currentPage === totalPages ? "inactive" : "active"
                        }
                        onClick={handlePageChange(currentPage + 1)}
                      >
                        {!providerPagination && (
                          <span className="mr-1">Next</span>
                        )}
                        <Next /> <span className="visuallyhidden">page</span>
                      </PaginationButton>
                    )}
                  </div>
                  {currentPage !== totalPages &&
                    matches.large &&
                    !providerPagination && (
                      <div className="ml-1 last">
                        <PaginationButton
                          state={
                            currentPage === totalPages ? "inactive" : "active"
                          }
                          onClick={handlePageChange(totalPages)}
                        >
                          Last <span className="visuallyhidden">page</span>
                        </PaginationButton>
                      </div>
                    )}
                </ul>
              </nav>
            ) : null}
          </div>
        )
      }
    </Media>
  );
};
