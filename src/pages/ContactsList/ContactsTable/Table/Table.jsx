import React, { useState, useEffect, useCallback } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import PropTypes from "prop-types";
import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";
import { TableHeader } from "../TableHeader";
import { TableBody } from "../TableBody";
import styles from "./styles.module.scss";

const Table = ({ isLoading = false, columns }) => {
    const { setSelectedContacts, tableData } = useContactsListContext();

    // State for sorting and row selection
    const [sorting, setSorting] = useState([]);
    const [rowSelection, setRowSelection] = useState({});

    // Memoized handlers
    const handleSortingChange = useCallback(setSorting, []);
    const handleRowSelectionChange = useCallback(setRowSelection, []);

    // Initializing table instance
    const tableInstance = useReactTable({
        data: tableData,
        columns,
        state: { sorting, rowSelection },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: handleSortingChange,
        onRowSelectionChange: handleRowSelectionChange,
        manualPagination: true, // Ensures proper pagination control
    });

    // Ensure selected contacts update when rows are selected
    useEffect(() => {
        const selectedContacts = tableInstance
            .getSelectedRowModel()
            .flatRows.map((row) => row.original?.leadsId)
            .filter(Boolean);

        setSelectedContacts(selectedContacts); // Always update, even if empty
    }, [rowSelection, tableInstance, setSelectedContacts]);

    return (
        <table className={styles.customTable}>
            <TableHeader headerGroups={tableInstance.getHeaderGroups()} />
            <TableBody rows={tableInstance.getRowModel().rows} isLoading={isLoading} />
        </table>
    );
};

Table.propTypes = {
    isLoading: PropTypes.bool, // Indicates if data is loading
    columns: PropTypes.arrayOf(PropTypes.object).isRequired, // Column definitions
};

Table.defaultProps = {
    isLoading: false,
};

export default Table;