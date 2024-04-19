import { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import ArrowRight from "components/icons/version-2/ArrowRight";
import Modal from "components/Modal";
import { getLocalDateTime, getOverDue, sortListByDate } from "utils/dates";
import EditIcon from "components/icons/icon-edit";
import { Button } from "components/ui/Button";
import styles from "./ReminderList.module.scss";
import { Reminder } from "components/icons/version-2/Reminder";
import useAnalytics from "hooks/useAnalytics";

const RemindersList = ({
    open,
    onClose,
    reminders,
    leadData,
    isMobile,
    setSelectedReminder,
    setShowEditReminderModal,
    view,
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
                {sortedReminders?.map((reminder) => (
                    <Box key={reminder.id} className={styles.reminderCard}>
                        <Box className={styles.reminderItem}>
                            <Box className={styles.reminderDue}>
                                <Reminder color={getOverDue(reminder.reminderDate) ? "#F44236" : "#4178FF"} />
                                <Box className={styles.dueDateStyles}>
                                    <Box className={styles.dueLabel}>
                                        Due:{" "}
                                        <span className={styles.dueValue}>
                                            {getLocalDateTime(reminder.reminderDate).date}
                                        </span>
                                    </Box>
                                    <Box className={styles.dueLabel}>
                                        At:{" "}
                                        <span className={styles.dueValue}>
                                            {getLocalDateTime(reminder.reminderDate).time}
                                        </span>
                                    </Box>
                                </Box>
                            </Box>
                            {!reminder.isComplete && (
                                <Box className={styles.reminderActions}>
                                    <Button
                                        icon={<EditIcon />}
                                        label="Edit"
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
                            )}
                        </Box>
                        <Box className={styles.reminderNote}>{reminder.reminderTitle || "Untitled Reminder"}</Box>
                    </Box>
                ))}
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
};

export default RemindersList;
