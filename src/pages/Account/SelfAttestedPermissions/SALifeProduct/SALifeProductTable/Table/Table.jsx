/* eslint-disable max-lines-per-function */

/* eslint-disable react/prop-types */
import {useCallback, useEffect, useMemo, useState} from "react";
// import { useSortBy, useTable } from "react-table"; // TODO: react-table migration
import {useReactTable} from "@tanstack/react-table";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import useDataHandler from "../../hooks/useDataHandler";

import useAnalytics from "hooks/useAnalytics";

import EditIcon from "components/icons/icon-edit";
import TrashBinIcon from "components/icons/trashbin";
import SaveBlue from "components/icons/version-2/SaveBlue";
import {Button} from "components/ui/Button";
import {Select} from "components/ui/Select";

import {ErrorBanner} from "pages/Account/SelfAttestedPermissions/ErrorBanner";

import {EditableCell} from "./EditableCell";
import {SAAddNewRow} from "./SAAddNewRow";
import styles from "./styles.module.scss";

import {useSALifeProductContext} from "../../providers/SALifeProductProvider";
import {TableBody} from "../TableBody";
import {TableHeader} from "../TableHeader";
import InfoRedIcon from "components/icons/info-red";
import {dateFormatter} from "utils/dateFormatter";
import {useSAPModalsContext} from "pages/Account/SelfAttestedPermissions/SAHealthProduct/providers/SAPModalProvider";

function Table({data}) {
    const [invalidProducerId, setInvalidProducerId] = useState(false);
    const {setIsExpriedModalOpen} = useSAPModalsContext();
    const [updatedData, setUpdatedData] = useState(data);
    const [editableRow, setEditableRow] = useState(null);
    const {updateRecord} = useDataHandler();
    const {error, setError} = useSALifeProductContext();
    const {fireEvent} = useAnalytics();

    const toggleEditMode = useCallback(
        (rowIndex) => {
            setEditableRow(editableRow === rowIndex ? null : rowIndex);
        },
        [editableRow]
    );

    const updateMyData = useCallback(
        (rowIndex, columnId, value) => {
            setUpdatedData((oldData) =>
                oldData.map((row) => (rowIndex === row.fexAttestationId ? {...row, [columnId]: value} : row))
            );
        },
        [setUpdatedData]
    );

    const onDeleteHandle = useCallback(
        async (record) => {
            await updateRecord({...record, inActive: 1});
            fireEvent("RTS Attestation Deleted", {
                line_of_business: "Life",
                product_type: "final_expense",
                leadid: record.agentNPN,
                carrier: record.carrierName,
            });
        },
        [fireEvent, updateRecord]
    );

    const onSaveHandle = useCallback(
        (record) => {
            const editedRow = updatedData.find((row) => record.fexAttestationId === row.fexAttestationId);
            updateRecord(editedRow);
            fireEvent("RTS Attestation Edited", {
                line_of_business: "Life",
                product_type: "final_expense",
                leadid: record.agentNPN,
                carrier: record.carrierName,
            });
        },
        [fireEvent, updateRecord, updatedData]
    );

    useEffect(() => {
        setUpdatedData(data);
    }, [data]);

    const columns = useMemo(
        () => [
            {
                Header: "Carrier",
                accessor: "displayCarrierName",
                Cell: ({value}) => {
                    return <Box className={styles.carrierColumn}>{value}</Box>;
                },
                EditableCell: ({row}) => {
                    return (
                        <Box>
                            <Box className={styles.title}>Carrier</Box>
                            <Select
                                placeholder={row?.original.displayCarrierName}
                                style={{width: "100%"}}
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
                                style={{width: "100%"}}
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
                Cell: ({value}) => {
                    return <Box className={styles.customTextField}>{value}</Box>;
                },
                EditableCell: ({cell}) => {
                    return (
                        <Box className={styles.customTextField}>
                            <Box className={styles.title}>Producer ID</Box>
                            <EditableCell
                                {...cell}
                                updateMyData={updateMyData}
                                validate={true}
                                setInvalidProducerId={setInvalidProducerId}
                            />
                        </Box>
                    );
                },
            },
            {
                Header: "Date Added",
                accessor: "createDate",
                disableSortBy: true,
                Cell: ({value, row}) => {
                    const isExpired = row.original.isExpired;
                    return (
                        <Box>
                            {isExpired ? (
                                <Box className={styles.expiredColumn}>
                                    <Box className={styles.expiredIcon} onClick={() => setIsExpriedModalOpen(true)}>
                                        <InfoRedIcon/>
                                    </Box>
                                    <Box>Expired</Box>
                                </Box>
                            ) : (
                                dateFormatter(value, "MM-DD-YY")
                            )}
                        </Box>
                    );
                },
                EditableCell: () => <></>,
            },
            {
                Header: () => <></>,
                accessor: "actions",
                disableSortBy: true,
                Cell: ({row}) => {
                    const isExpired = row.original.isExpired;
                    return (
                        <Box display="flex" textAlign="center" justifyContent="right" paddingRight="20px">
                            <Button
                                icon={isExpired ? <TrashBinIcon color="#4178ff"/> : <EditIcon color="#4178ff"/>}
                                label={isExpired ? "Delete" : "Edit"}
                                className={styles.buttonWithIcon}
                                onClick={
                                    isExpired
                                        ? () => onDeleteHandle(row?.original)
                                        : () => toggleEditMode(row?.original?.fexAttestationId)
                                }
                                type="tertiary"
                                iconPosition="right"
                            />
                        </Box>
                    );
                },
                EditableCell: ({row}) => {
                    return (
                        <Box display="flex" textAlign="center" justifyContent="right" paddingRight="20px" gap="40px">
                            <Button
                                icon={<TrashBinIcon color="#4178ff"/>}
                                label="Delete"
                                className={styles.buttonWithIcon}
                                onClick={() => onDeleteHandle(row?.original)}
                                type="tertiary"
                                iconPosition="right"
                            />
                            <Button
                                icon={<SaveBlue/>}
                                label="Save"
                                className={styles.buttonWithIcon}
                                onClick={() => onSaveHandle(row?.original)}
                                type="tertiary"
                                iconPosition="right"
                                disabled={invalidProducerId}
                            />
                        </Box>
                    );
                },
            },
        ],
        [onDeleteHandle, onSaveHandle, toggleEditMode, updateMyData, invalidProducerId]
    );

    const {getTableProps, getTableBodyProps, headerGroups, prepareRow, rows} = useReactTable(
        {
            columns,
            data: updatedData,
        },
        // useSortBy
    );

    return (
        <table className={styles.customTable} {...getTableProps()}>
            <TableHeader headerGroups={headerGroups}/>
            {error && <ErrorBanner retry={() => setError(null)}/>}
            {!error && (
                <>
                    <TableBody
                        getTableBodyProps={getTableBodyProps}
                        rows={rows}
                        prepareRow={prepareRow}
                        editableRow={editableRow}
                    />
                    <SAAddNewRow/>
                </>
            )}
        </table>
    );
}

Table.propTypes = {
    data: PropTypes.array,
};

export default Table;
