import PropTypes from "prop-types";

import Sort from "components/icons/sort-arrow";
import SortDown from "components/icons/sort-arrow-down";
import SortUp from "components/icons/sort-arrow-up";

import styles from "./styles.module.scss";

function TableHeader({ headerGroups }) {
    return (
        <thead>
            {headerGroups.map((headerGroup, i) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                    {headerGroup.headers.map((column, index) => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())} key={index}>
                            <div className={styles.customHeader}>
                                <span>{column.render("Header")}</span>
                                <span className={styles.sortingIcon}>
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <SortDown />
                                        ) : (
                                            <SortUp />
                                        )
                                    ) : column.disableSortBy ? (
                                        ""
                                    ) : (
                                        <Sort />
                                    )}
                                </span>
                            </div>
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    );
}

TableHeader.propTypes = {
    headerGroups: PropTypes.array,
};

export default TableHeader;
