import { useSortBy, useTable } from "react-table";

import PropTypes from "prop-types";

import styles from "./styles.module.scss";

import { SAAddPermissionForm } from "../../SAAddPermissionForm";
import { TableBody } from "../TableBody";
import { TableHeader } from "../TableHeader";

function Table({ columns, data }) {
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
        {
            columns,
            data,
        },
        useSortBy
    );

    return (
        <table className={styles.customTable} {...getTableProps()}>
            <TableHeader headerGroups={headerGroups} />
            <SAAddPermissionForm />
            <TableBody getTableBodyProps={getTableBodyProps} rows={rows} prepareRow={prepareRow} />
        </table>
    );
}

Table.propTypes = {
    data: PropTypes.array,
    columns: PropTypes.array,
};

export default Table;
