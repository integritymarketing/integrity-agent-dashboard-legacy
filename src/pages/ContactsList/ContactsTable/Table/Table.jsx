import React, { useState, useEffect } from "react";
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

const Table = ({ isLoading, columns }) => {
    const { setSelectedContacts, tableData } = useContactsListContext();
    const [sorting, setSorting] = useState([]);
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: tableData || [],
        columns,
        state: { sorting, rowSelection },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
    });

    useEffect(() => {
        const selectedContacts = table.getSelectedRowModel().flatRows.map((contact) => contact.original.leadsId);
        setSelectedContacts(selectedContacts);
    }, [table.getSelectedRowModel(), setSelectedContacts]);

    return (
        <table className={styles.customTable}>
            <TableHeader headerGroups={table.getHeaderGroups()} />
            <TableBody rows={table.getRowModel().rows} isLoading={isLoading} />
        </table>
    );
};

Table.propTypes = {
    isLoading: PropTypes.bool,
    columns: PropTypes.array.isRequired,
};

export default Table;
