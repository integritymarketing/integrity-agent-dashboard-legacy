import { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowRight from "components/icons/version-2/ArrowRight";
import Modal from "components/Modal";
import { getLocalDateTime, getOverDue, sortListByDate } from "utils/dates";
import EditIcon from "components/icons/icon-edit";
import styles from "./ReminderList.module.scss";
import useAnalytics from "hooks/useAnalytics";
import {
    Reminder,
    AskIntegrityReminderIcon,
    Complete,
} from "components/ContactDetailsContainer/OverviewContainer/Icons";
import TextFormatter from "components/Shoppers/ShoppersTextFormat";

const RemindersList = ({
    open,
    onClose,
    reminders,
    leadData,
    isMobile,
    setSelectedReminder,
    setShowEditReminderModal,
    view,
    updateReminder,
}) => {
    const filteredReminders = reminders?.filter((reminder) => !reminder.isComplete);
    const sortedReminders = sortListByDate(filteredReminders, "reminderDate", true);
    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();

    useEffect(() => {
        if (open) {
            const reminderLabelString = sortedReminders
                .map((reminder) => {
                    const { date, time } = getLocalDateTime(reminder.reminderDate);
                    return `${date} at ${time}`;
                })
                .join(", ");
            fireEvent("Contact List Tag Viewed", {
                leadid: leadData?.leadsId,
                view,
                content: reminderLabelString,
                tag_category: "reminders",
            });
        }
    }, [open, fireEvent, sortedReminders, leadData?.leadsId, view]);

    const onViewContactHandle = useCallback(() => {
        navigate(`/contact/${leadData.leadsId}/overview`);
    }, [leadData.leadsId, navigate]);

    const fullName = [leadData.firstName, leadData.middleName, leadData.lastName].filter(Boolean).join(" ");

    return (
        <Modal
            maxWidth="sm"
            open={open}
            onClose={onClose}
            title={
                <Box display="flex" alignItems="center">
                    <span className={styles.reminderTitleIcon}>
                        <Reminder />
                    </span>{" "}
                    Reminders
                </Box>
            }
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} width="100%">
                <Box className={styles.name}>{fullName}</Box>
                <Box className={styles.link} onClick={onViewContactHandle}>
                    {!isMobile && "View Contact"} <ArrowRight />
                </Box>
            </Box>
            <Box>
                {sortedReminders?.map((reminder) => {
                    const {
                        reminderNote = "",
                        isComplete = false,
                        reminderDate,
                        reminderTitle,
                        reminderSource,
                    } = reminder;

                    const isOverDue = getOverDue(reminderDate) ? true : false;

                    return (
                        <Box key={reminder.id} className={styles.reminderCard}>
                            <Box className={styles.reminderItem}>
                                <Box className={styles.reminderDatesInfo}>
                                    <Box>
                                        {reminderSource !== "Ask Integrity" ? (
                                            <>
                                                <Reminder
                                                    color={isOverDue ? "#C81E27" : "#4178FF"}
                                                    bgColor={isOverDue ? "#FBDEDE" : "#F1FAFF"}
                                                />
                                            </>
                                        ) : (
                                            <AskIntegrityReminderIcon
                                                color={isOverDue ? "#C81E27" : "#4178FF"}
                                                bgColor={isOverDue ? "#FBDEDE" : "#F1FAFF"}
                                            />
                                        )}
                                    </Box>
                                    <Box className={styles.reminderDates}>
                                        <Box className={styles.dueLabel}>
                                            Due:
                                            <span
                                                className={`${styles.dueValue} ${isOverDue ? styles.overDueValue : ""}`}
                                            >
                                                {getLocalDateTime(reminderDate)?.date}
                                            </span>
                                        </Box>
                                        {getLocalDateTime(reminder.reminderDate)?.time !== "12:00 am" && (
                                            <Box className={styles.dueLabel}>
                                                At:
                                                <span
                                                    className={`${styles.dueValue} ${
                                                        isOverDue ? styles.overDueValue : ""
                                                    }`}
                                                >
                                                    {getLocalDateTime(reminderDate)?.time}
                                                </span>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                                {!isComplete && (
                                    <Box className={styles.reminderActions}>
                                        {!isComplete && (
                                            <>
                                                <Box>
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        color="primary"
                                                        endIcon={<Complete color="#4178FF" />}
                                                        onClick={() => updateReminder(reminder, true)}
                                                    >
                                                        {!isMobile ? "Complete" : ""}
                                                    </Button>
                                                </Box>
                                                <Box className={styles.editButton}>
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        color="primary"
                                                        endIcon={<EditIcon />}
                                                        onClick={() => {
                                                            setSelectedReminder(reminder);
                                                            setShowEditReminderModal(true);
                                                            onClose();
                                                        }}
                                                    >
                                                        {!isMobile ? "Edit" : ""}
                                                    </Button>
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                )}
                            </Box>

                            <Box className={styles.reminderNote}>
                                {reminderSource !== "Ask Integrity" ? (
                                    reminderTitle || "Untitled Reminder"
                                ) : (
                                    <>
                                        {reminderTitle || "Untitled Reminder"}
                                        <Box marginTop="8px">
                                            <TextFormatter inputText={reminderNote} fontSize="16px" color="#434A51" />
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Modal>
    );
};

RemindersList.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    reminders: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            reminderTitle: PropTypes.string,
            reminderDate: PropTypes.string.isRequired,
            isComplete: PropTypes.bool,
        })
    ),
    leadData: PropTypes.shape({
        leadsId: PropTypes.number.isRequired,
        firstName: PropTypes.string,
        middleName: PropTypes.string,
        lastName: PropTypes.string,
    }).isRequired,
    isMobile: PropTypes.bool,
    setSelectedReminder: PropTypes.func.isRequired,
    setShowEditReminderModal: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
    updateReminder: PropTypes.func.isRequired,
};

export default RemindersList;
