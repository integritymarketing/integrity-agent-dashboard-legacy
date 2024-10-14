import React from "react";
import Media from "react-media";
import Next from "components/icons/next";
import Previous from "components/icons/previous";
import { Select } from "components/ui/Select";

import "./pagination.scss";
import PreviousIcon from "components/icons/version-2/PreviousIcon";

const PaginationButton = ({ isNavButton, state = "active", children, ...props }) => (
    <li
        className={`pagination__button pagination__button--${state} ${isNavButton ? "pagination__button--nav" : ""}`}
        {...props}
    >
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

const ResetPageSize = ({ size, resetSize }) => {
    const OPTIONS = [
        { value: 25, label: 25 },
        { value: 50, label: 50 },
        { value: 100, label: 100 },
    ];

    return (
        <>
            <Select initialValue={size} onChange={(value) => resetSize(value)} options={OPTIONS} />
        </>
    );
};

const Pagination = ({
    totalPages = 5,
    totalResults,
    currentPage = 1,
    pageSize = 12,
    resultName = "contacts",
    isSeparateBoxes = false,
    onPageChange = noop,
    providerPagination = false,
    contactsCardPage = false,
    onResetPageSize = false,
    setPageSize,
    ...props
}) => {
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) {return noop;}
        return () => onPageChange(page);
    };

    const showingFrom = (currentPage - 1) * pageSize + 1;
    const showingTo = currentPage * pageSize > totalResults ? totalResults : currentPage * pageSize;

    return (
        <Media
            queries={{
                large: "(min-width: 500px)",
            }}
        >
            {(matches) =>
                ((!matches.large && (providerPagination || contactsCardPage)) || matches.large) && (
                    <div
                        className={`pagination-container ${
                            isSeparateBoxes ? "pagination-container-separateBoxes" : ""
                        }`}
                    >
                        {onResetPageSize ? (
                            <div className="pagination-display-results">
                                Showing
                                <div className="reset-select-input ">
                                    <ResetPageSize size={pageSize} resetSize={(value) => setPageSize(value)} />
                                </div>
                                of {`${totalResults} ${resultName}`}
                            </div>
                        ) : (
                            <>
                                {!providerPagination && (
                                    <div className="pagination-display-results">
                                        {`Showing ${showingFrom} - ${showingTo} of ${totalResults} ${resultName}`}
                                    </div>
                                )}
                            </>
                        )}
                        {totalPages > 1 ? (
                            <nav
                                aria-label="pagination"
                                className={`pagination ${matches.large ? "" : "pagination--mini"}`}
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
                                                isNavButton={isSeparateBoxes}
                                                state={currentPage === 1 ? "inactive" : "active"}
                                                onClick={handlePageChange(currentPage - 1)}
                                            >
                                                {isSeparateBoxes ? (
                                                    <span className="previous-icon">
                                                        <PreviousIcon />
                                                    </span>
                                                ) : (
                                                    <span className="mr-1">
                                                        <Previous />
                                                    </span>
                                                )}
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
                                                isNavButton={isSeparateBoxes}
                                                state={currentPage === totalPages ? "inactive" : "active"}
                                                onClick={handlePageChange(currentPage + 1)}
                                            >
                                                {!providerPagination && <span className="mr-1">Next</span>}
                                                {isSeparateBoxes ? (
                                                    <span className="next-icon">
                                                        <PreviousIcon />
                                                    </span>
                                                ) : (
                                                    <Next />
                                                )}
                                                <span className="visuallyhidden">page</span>
                                            </PaginationButton>
                                        )}
                                    </div>
                                    {currentPage !== totalPages && matches.large && !providerPagination && (
                                        <div className="ml-1 last">
                                            <PaginationButton
                                                state={currentPage === totalPages ? "inactive" : "active"}
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

export default Pagination;
