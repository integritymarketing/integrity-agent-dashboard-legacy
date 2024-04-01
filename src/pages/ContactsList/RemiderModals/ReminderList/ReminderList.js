/* eslint-disable max-lines-per-function */
import { useCallback } from "react";

import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import ArrowRight from "components/icons/version-2/ArrowRight";

import Modal from "components/Modal";

import { getLocalDateTime, getOverDue, sortListByDate } from "utils/dates";

import EditIcon from "components/icons/icon-edit";
import { Button } from "components/ui/Button";

import styles from "./ReminderList.module.scss";

import { Reminder } from "components/icons/version-2/Reminder";

const RemindersList = ({
    open,
    onClose,
    reminders,
    leadData,
    isMobile,
    setSelectedReminder,
    setShowEditReminderModal,
}) => {
    const remindersList = reminders?.filter((reminder) => !reminder?.isComplete);
    const sortedReminders = sortListByDate(remindersList, "reminderDate", true);
    const navigate = useNavigate();
    const onViewContactHandle = useCallback(() => {
        navigate(`/contact/${leadData.leadsId}/overview`);
    }, [leadData.leadsId, navigate]);

    const name = `${leadData?.firstName ?? ""} ${leadData?.middleName ?? ""} ${leadData?.lastName ?? ""}`;

    return (
        <Modal
            maxWidth="sm"
            open={open}
            onClose={onClose}
            title={
                <Box display="flex">
                    <span className={styles.reminderTitleIcon}>
                        <Reminder />
                    </span>{" "}
                    Reminders
                </Box>
            }
        >
            <>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom={"20px"}
                    width={"100%"}
                >
                    <Box className={styles.name}>{name}</Box>
                    <Box className={styles.link} onClick={onViewContactHandle}>
                        {!isMobile && <>View Contact</>} <ArrowRight />
                    </Box>
                </Box>
                <Box>
                    {sortedReminders?.map((reminder) => {
                        const { reminderNote = "", isComplete = false, reminderDate } = reminder;
                        const isOverDue = getOverDue(reminderDate) ? true : false;
                        return (
                            <Box className={styles.reminderCard}>
                                <Box className={styles.reminderItem}>
                                    <Box className={styles.reminderDue}>
                                        <Box>
                                            <Reminder color={isOverDue ? "#F44236" : "#4178FF"} />
                                        </Box>
                                        <Box className={styles.dueDateStyles}>
                                            <Box className={styles.dueLabel}>
                                                Due:
                                                <span className={styles.dueValue}>
                                                    {getLocalDateTime(reminderDate)?.date}
                                                </span>
                                            </Box>
                                            <Box className={styles.dueLabel}>
                                                At:
                                                <span className={styles.dueValue}>
                                                    {getLocalDateTime(reminderDate)?.time}
                                                </span>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box className={styles.reminderActions}>
                                        {!isComplete && (
                                            <>
                                                <Box className={styles.editButton}>
                                                    <Button
                                                        icon={<EditIcon />}
                                                        label={"Edit"}
                                                        className={styles.buttonWithIcon}
                                                        onClick={() => {
                                                            setSelectedReminder(reminder);
                                                            setShowEditReminderModal(true);
                                                            onClose();
                                                        }}
                                                        type="tertiary"
                                                        iconPosition="right"
                                                    />
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                                <Box className={styles.reminderNote}>{reminderNote}</Box>
                            </Box>
                        );
                    })}
                </Box>
            </>
        </Modal>
    );
};

export default RemindersList;
