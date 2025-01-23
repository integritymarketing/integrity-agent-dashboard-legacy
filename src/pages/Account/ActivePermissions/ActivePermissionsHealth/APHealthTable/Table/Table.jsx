/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { useSortBy, useTable } from "react-table";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import styles from "./styles.module.scss";

import { ActivePermissionFilter } from "../../../ActivePermissionFilter";
import { TableBody } from "../TableBody";
import { TableHeader } from "../TableHeader";

function Table({ data }) {
    const columns = useMemo(
        () => [
            {
                Header: "Plan Year",
                accessor: "planYear",
                Cell: ({ value }) => {
                    return <Box>{value}</Box>;
                },
            },
            {
                Header: "Carrier",
                accessor: "carrier",
                Cell: ({ value }) => {
                    return <Box className={styles.carrierColumn}>{value}</Box>;
                },
            },
            {
                Header: "State",
                accessor: "states",
                disableSortBy: true,
                Cell: ({ value }) => {
                    return <Box>{value?.join(", ")}</Box>;
                },
            },
            {
                Header: "Product",
                accessor: "planTypes",
                disableSortBy: true,
                Cell: ({ value }) => {
                    return (
                        <Box display="flex" gap="10px" flexWrap="wrap">
                            {value?.map((planType) => (
                                <Box className={styles.pill} key={planType}>
                                    {planType}
                                </Box>
                            ))}
                        </Box>
                    );
                },
            },
            {
                Header: "Producer ID",
                accessor: "producerId",
                disableSortBy: true,
                Cell: ({ value }) => {
                    return <Box className={styles.producerIdColumn}>{value}</Box>;
                },
            },
            {
                Header: () => <ActivePermissionFilter />,
                accessor: "filter",
                disableSortBy: true,
                Cell: () => <></>,
            },
        ],
        []
    );

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
            <TableBody getTableBodyProps={getTableBodyProps} rows={rows} prepareRow={prepareRow} />
        </table>
    );
}

Table.propTypes = {
    data: PropTypes.array,
};

export default Table;
