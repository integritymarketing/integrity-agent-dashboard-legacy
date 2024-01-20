/* eslint-disable react/prop-types */
import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRowSelect, useSortBy, useTable } from "react-table";

import useAnalytics from "hooks/useAnalytics";
import useToast from "hooks/useToast";

import DeleteLeadContext from "contexts/deleteLead";

import clientsService from "services/clientsService";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./styles.module.scss";

import { TableBody } from "../TableBody";
import { TableHeader } from "../TableHeader";

function Table({ columns }) {
    const { setSelectedContacts, tableData } = useContactsListContext();
    const showToast = useToast();
    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();

    const { deleteLeadId, setDeleteLeadId, setLeadName, leadName } = useContext(DeleteLeadContext);

    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, selectedFlatRows } = useTable(
        {
            columns,
            data: tableData,
        },
        useSortBy,
        useRowSelect
    );

    useEffect(() => {
        setSelectedContacts(selectedFlatRows.map((contact) => contact.original.leadsId));
    }, [selectedFlatRows, setSelectedContacts]);

    const deleteContact = useCallback(() => {
        if (deleteLeadId !== null) {
            const clearTimer = () =>
                setTimeout(() => {
                    clearContext();
                }, 10000);
            clearTimer();
            const clearContext = () => {
                setDeleteLeadId(null);
                setLeadName(null);
            };
            const unDODelete = async () => {
                const response = await clientsService.reActivateClients([deleteLeadId]);
                if (response.ok) {
                    clearContext();
                    navigate(`/contact/${deleteLeadId}/overview`);
                } else if (response.status === 400) {
                    showToast({
                        type: "error",
                        message: "Error while reactivating contact",
                    });
                }
            };

            showToast({
                type: "success",
                message: `${leadName} Deleted`,
                time: 10000,
                link: "UNDO",
                onClickHandler: unDODelete,
                closeToastRequired: true,
                onCloseCallback: clearContext,
            });
        }
    }, [deleteLeadId, showToast, leadName, setDeleteLeadId, setLeadName, navigate]);

    useEffect(() => {
        fireEvent("Contact List Viewed", {
            // TODO-EVENT
            contacts_with_health_policies_count: 0,

            contacts_without_policies_count: 0,

            contacts_with_life_policies_count: 0,

            total_contacts_count: rows?.length,
        });
    }, []);

    useEffect(() => {
        deleteContact();
    }, [deleteLeadId, deleteContact]);

    return (
        <table className={styles.customTable} {...getTableProps()}>
            <TableHeader headerGroups={headerGroups} />
            <TableBody getTableBodyProps={getTableBodyProps} rows={rows} prepareRow={prepareRow} />
        </table>
    );
}

export default Table;
