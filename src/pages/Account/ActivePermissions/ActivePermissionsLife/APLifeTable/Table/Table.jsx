/* eslint-disable react/prop-types */
import {useCallback, useMemo, useState} from "react";
// import { useSortBy, useTable } from "react-table"; // TODO: react-table migration
import {useReactTable} from "@tanstack/react-table";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import styles from "./styles.module.scss";

import {TableBody} from "../TableBody";
import {TableHeader} from "../TableHeader";
import {toSentenceCase} from "utils/toSentenceCase";

function Table({data}) {
    const columns = useMemo(
        () => [
            {
                Header: "Carrier",
                accessor: "csgCarrierName",
                Cell: ({value}) => {
                    return <Box className={styles.carrierColumn}>{value}</Box>;
                },
            },
            {
                Header: "Product",
                accessor: "productCategoryName",
                disableSortBy: true,
                Cell: ({value}) => {
                    const formattedValue = toSentenceCase(value);
                    return <Box className={styles.pill}>{formattedValue}</Box>;
                },
            },
            {
                Header: "Producer ID",
                accessor: "agentWritingNumber",
                disableSortBy: true,
                Cell: ({value}) => {
                    return <Box className={styles.customTextField}>{value}</Box>;
                },
            },
            {
                Header: () => <></>,
                accessor: "actions",
                disableSortBy: true,
                Cell: <></>,
            },
        ],
        []
    );

    const {getTableProps, getTableBodyProps, headerGroups, prepareRow, rows} = useReactTable(
        {
            columns,
            data,
        },
        // useSortBy
    );

    return (
        <table className={styles.customTable} {...getTableProps()}>
            <TableHeader headerGroups={headerGroups}/>
            <TableBody getTableBodyProps={getTableBodyProps} rows={rows} prepareRow={prepareRow}/>
        </table>
    );
}

Table.propTypes = {
    data: PropTypes.array,
};

export default Table;
