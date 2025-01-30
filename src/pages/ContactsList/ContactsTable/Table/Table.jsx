/* eslint-disable react/prop-types */
import {useEffect} from "react";
// import {useRowSelect, useSortBy, useTable} from "react-table";
import {useReactTable} from "@tanstack/react-table"; // TODO: react-table migration

import {useContactsListContext} from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./styles.module.scss";

import {TableBody} from "../TableBody";
import {TableHeader} from "../TableHeader";

function Table({columns, isLoading}) {
    const {setSelectedContacts, tableData} = useContactsListContext();

    const {getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, selectedFlatRows} = useReactTable(
        {
            columns,
            data: tableData,
        },
        //useSortBy,
        //useRowSelect
    );

    useEffect(() => {
        setSelectedContacts(selectedFlatRows.map((contact) => contact.original.leadsId));
    }, [selectedFlatRows, setSelectedContacts]);

    return (
        <table className={styles.customTable} {...getTableProps()}>
            <TableHeader headerGroups={headerGroups}/>
            <TableBody
                getTableBodyProps={getTableBodyProps}
                rows={rows}
                prepareRow={prepareRow}
                getRowKey={(row) => row.original.leadsId}
                isLoading={isLoading}
            />
        </table>
    );
}

export default Table;
