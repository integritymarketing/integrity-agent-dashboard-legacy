import React from "react";
import { flexRender } from "@tanstack/react-table";
import PropTypes from "prop-types";
import SortArrow from "components/icons/version-2/SortArrow";

import styles from "./styles.module.scss";

const TableHeader = ({ headerGroups }) => {
    return (
        <thead>
            {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            className={styles.customHeader}
                        >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <span className={styles.sortingIcon}>{header.column.getCanSort() && <SortArrow />}</span>
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    );
};

TableHeader.propTypes = {
    headerGroups: PropTypes.array.isRequired,
};

export default TableHeader;
