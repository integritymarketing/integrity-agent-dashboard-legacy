import { useState, useCallback, useEffect } from "react";

import Box from "@mui/material/Box";

import SaveBlue from "components/icons/version-2/SaveBlue";
import TrashBinIcon from "components/icons/trashbin";
import EditIcon from "components/icons/icon-edit";
import InfoRedIcon from "components/icons/info-red";

import { Button } from "components/ui/Button";
import { dateFormatter } from "utils/dateFormatter";
import { SAAddNewRow } from "./Table/SAAddNewRow";
import { EditableCell } from "./Table/EditableCell";
import useDataHandler from "../hooks/useDataHandler";
import useAnalytics from "hooks/useAnalytics";
import { useSAPModalsContext } from "pages/Account/SelfAttestedPermissions/SAHealthProduct/providers/SAPModalProvider";
import styles from "./styles.module.scss";

const editableColumn = {
    id: "producerId",
};

const MobileSALife = ({ items }) => {
    const { setIsExpriedModalOpen } = useSAPModalsContext();
    const [invalidProducerId, setInvalidProducerId] = useState(false);
    const [editableRow, setEditableRow] = useState(null);
    const [updatedData, setUpdatedData] = useState(items);
    const { updateRecord } = useDataHandler();
    const { fireEvent } = useAnalytics();

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
        async (record) => {
            await updateRecord({ ...record, inActive: 1 });
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
        setUpdatedData(items);
    }, [items]);

    return (
        <>
            <div className={styles.sectionContainer}>
                <SAAddNewRow />

                {updatedData?.map((item, index) => {
                    const { displayCarrierName, producerId, createDate, isExpired } = item;
                    return (
                        <div key={index} className={styles.row}>
                            <div className={styles.column}>
                                <div className={styles.title}>Carrier:</div>
                                <div className={styles.spacing}>{displayCarrierName}</div>
                                <div className={styles.title}>Products:</div>
                                <div className={styles.pillWrapper}>
                                    <Box className={styles.pill}>{"Final Expense"}</Box>
                                </div>
                                <div className={styles.title}>{`Producer ID: `}</div>
                                {
                                    editableRow === item.fexAttestationId
                                        ? <EditableCell
                                            value={producerId}
                                            row={{ original: item }}
                                            column={editableColumn}
                                            updateMyData={updateMyData}
                                            validate={true}
                                            setInvalidProducerId={setInvalidProducerId}
                                        />
                                        : <div>{producerId}</div>
                                }
                            </div>
                            <div className={styles.column2}>
                                <div>
                                    <div className={styles.title}>Date Added:</div>
                                    {isExpired && <Box className={styles.expiredColumn} display="flex" alignItems="center">
                                        <Box className={styles.expiredIcon} onClick={() => setIsExpriedModalOpen(true)}>
                                            <InfoRedIcon />
                                        </Box>
                                        <Box className={styles.expired}>Expired</Box>
                                    </Box>}
                                    {!isExpired && <div>{dateFormatter(createDate, "MM-DD-YY")}</div>}
                                </div>
                                {
                                    editableRow === item.fexAttestationId
                                        ? <div>
                                            <Box
                                                display={"flex"}
                                                justifyContent={"right"}
                                                paddingRight={"20px"}>
                                                <Button
                                                    icon={<TrashBinIcon color="#4178ff" />}
                                                    label="Delete"
                                                    className={styles.buttonWithIcon}
                                                    onClick={() => onDeleteHandle(item)}
                                                    type="tertiary"
                                                    iconPosition="right"
                                                />
                                            </Box>
                                        </div>
                                        : null
                                }
                                <Box display="flex" textAlign="center" justifyContent="right" paddingRight="20px">
                                    {
                                        editableRow === item.fexAttestationId
                                            ? <>
                                                <Button
                                                    icon={<SaveBlue />}
                                                    label="Save"
                                                    className={styles.buttonWithIcon}
                                                    onClick={() => onSaveHandle(item)}
                                                    type="tertiary"
                                                    iconPosition="right"
                                                    disabled={invalidProducerId}
                                                />
                                            </>
                                            : <Button
                                                icon={
                                                    isExpired ? <TrashBinIcon color="#4178ff" /> : <EditIcon color="#4178ff" />
                                                }
                                                label={isExpired ? "Delete" : "Edit"}
                                                className={styles.buttonWithIcon}
                                                onClick={
                                                    isExpired
                                                        ? () => onDeleteHandle(item)
                                                        : () => toggleEditMode(item?.fexAttestationId)
                                                }
                                                type="tertiary"
                                                iconPosition="right"
                                            />
                                    }

                                </Box>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default MobileSALife;
