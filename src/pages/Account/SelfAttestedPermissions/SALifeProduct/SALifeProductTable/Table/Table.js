/* eslint-disable max-lines-per-function */

/* eslint-disable react/prop-types */
import { useCallback, useMemo, useState } from "react";
import { useSortBy, useTable } from "react-table";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import useDataHandler from "../../hooks/useDataHandler";

import EditIcon from "components/icons/icon-edit";
import TrashBinIcon from "components/icons/trashbin";
import SaveBlue from "components/icons/version-2/SaveBlue";
import { Button } from "components/ui/Button";
import { Select } from "components/ui/Select";

import { ErrorBanner } from "pages/Account/SelfAttestedPermissions/ErrorBanner";

import { EditableCell } from "./EditableCell";
import { SAAddNewRow } from "./SAAddNewRow";
import styles from "./styles.module.scss";

import { useSALifeProductContext } from "../../providers/SALifeProductProvider";
import { TableBody } from "../TableBody";
import { TableHeader } from "../TableHeader";

function Table({ data }) {
    const [updatedData, setUpdatedData] = useState(data);
    const [editableRow, setEditableRow] = useState(null);
    const { updateRecord } = useDataHandler();
    const { error, setError } = useSALifeProductContext();

    const toggleEditMode = useCallback(
        (rowIndex) => {
            setEditableRow(editableRow === rowIndex ? null : rowIndex);
        },
        [editableRow]
    );

    const updateMyData = useCallback(
        (rowIndex, columnId, value) => {
            setUpdatedData((oldData) =>
                oldData.map((row) => (rowIndex === row.fexAttestationId ? { ...row, [columnId]: value } : row))
            );
        },
        [setUpdatedData]
    );

    const onDeleteHandle = useCallback(
        (record) => {
            updateRecord({ ...record, inActive: 1 });
        },
        [updateRecord]
    );

    const onSaveHandle = useCallback(
        (record) => {
            const editedRow = updatedData.find((row) => record.fexAttestationId === row.fexAttestationId);
            updateRecord(editedRow);
        },
        [updateRecord, updatedData]
    );

    const columns = useMemo(
        () => [
            {
                Header: "Carrier",
                accessor: "displayCarrierName",
                Cell: ({ value }) => {
                    return <Box className={styles.carrierColumn}>{value}</Box>;
                },
                EditableCell: ({ row }) => {
                    return (
                        <Box>
                            <Box className={styles.title}>Carrier</Box>
                            <Select
                                placeholder={row?.original.carrierName}
                                style={{ width: "100%" }}
                                showValueAlways={false}
                                disabled={true}
                            />
                        </Box>
                    );
                },
            },
            {
                Header: "Product",
                accessor: "static",
                disableSortBy: true,
                Cell: () => {
                    return <Box className={styles.pill}>Final Expense</Box>;
                },
                EditableCell: () => {
                    return (
                        <Box>
                            <Box className={styles.title}>Product</Box>
                            <Select
                                placeholder="Final Expense"
                                style={{ width: "100%" }}
                                showValueAlways={false}
                                disabled={true}
                            />
                        </Box>
                    );
                },
            },
            {
                Header: "Producer ID",
                accessor: "producerId",
                disableSortBy: true,
                Cell: ({ value }) => {
                    return <Box className={styles.customTextField}>{value}</Box>;
                },
                EditableCell: ({ cell }) => {
                    return (
                        <Box className={styles.customTextField}>
                            <Box className={styles.title}>Producer ID</Box>
                            <EditableCell {...cell} updateMyData={updateMyData} />
                        </Box>
                    );
                },
            },
            {
                Header: () => <></>,
                accessor: "actions",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <Box display="flex" textAlign="center" justifyContent="right" paddingRight="20px">
                        <Button
                            icon={<EditIcon color="#4178ff" />}
                            label="Edit"
                            className={styles.buttonWithIcon}
                            onClick={() => toggleEditMode(row?.original?.fexAttestationId)}
                            type="tertiary"
                            iconPosition="right"
                        />
                    </Box>
                ),
                EditableCell: ({ row }) => {
                    return (
                        <Box display="flex" textAlign="center" justifyContent="right" paddingRight="20px" gap="40px">
                            <Button
                                icon={<TrashBinIcon color="#4178ff" />}
                                label="Delete"
                                className={styles.buttonWithIcon}
                                onClick={() => onDeleteHandle(row?.original)}
                                type="tertiary"
                                iconPosition="right"
                            />
                            <Button
                                icon={<SaveBlue />}
                                label="Save"
                                className={styles.buttonWithIcon}
                                onClick={() => onSaveHandle(row?.original)}
                                type="tertiary"
                                iconPosition="right"
                            />
                        </Box>
                    );
                },
            },
        ],
        [onDeleteHandle, onSaveHandle, toggleEditMode, updateMyData]
    );

    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
        {
            columns,
            data: updatedData,
        },
        useSortBy
    );

    return (
        <table className={styles.customTable} {...getTableProps()}>
            <TableHeader headerGroups={headerGroups} />
            {error && <ErrorBanner retry={() => setError(null)} />}
            {!error && (
                <>
                    <TableBody
                        getTableBodyProps={getTableBodyProps}
                        rows={rows}
                        prepareRow={prepareRow}
                        editableRow={editableRow}
                    />
                    <SAAddNewRow />
                </>
            )}
        </table>
    );
}

Table.propTypes = {
    data: PropTypes.array,
};

export default Table;
