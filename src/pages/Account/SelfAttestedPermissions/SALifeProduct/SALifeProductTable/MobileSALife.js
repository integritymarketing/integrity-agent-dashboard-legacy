import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";
import styles from "./styles.module.scss";
import { dateFormatter } from "utils/dateFormatter";
import EditIcon from "components/icons/icon-edit";
import TrashbinIcon from "components/icons/trashbin";
import { SAAddNewRow } from "./Table/SAAddNewRow";

const MobileSALife = ({ items }) => {
    return (
        <>
            <div className={styles.sectionContainer}>
                <SAAddNewRow />

                {items?.map((item, index) => {
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
                                <div>{producerId}</div>
                            </div>
                            <div className={styles.column2}>
                                <div>
                                    <div className={styles.title}>Date Added:</div>
                                    <div>{dateFormatter(createDate, "MM-DD-YY")}</div>
                                </div>
                                <Box display="flex" textAlign="center" justifyContent="right" paddingRight="20px">
                                    <Button
                                        icon={
                                            isExpired ? <TrashbinIcon color="#4178ff" /> : <EditIcon color="#4178ff" />
                                        }
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
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default MobileSALife;
