/* eslint-disable max-lines-per-function */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Box, Grid, Typography, Button } from "@mui/material";

import { useOverView, useLeadDetails } from "providers/ContactDetails";

import { getLocalDateTime, getOverDue, sortListByDate } from "utils/dates";

import ContactSectionCard from "packages/ContactSectionCard";

import { AddReminderModal } from "components/ContactDetailsContainer/ContactDetailsModals/AddReminderModal/AddReminderModal";
import EditIcon from "components/icons/icon-edit";
import Plus from "components/icons/plus";
import TextFormatter from "components/Shoppers/ShoppersTextFormat";
import { Button as OldButton } from "components/ui/Button";

import styles from "./RemindersList.module.scss";

import { Reminder, AskIntegrityReminderIcon, Complete, Delete } from "../../Icons";

export const RemindersList = () => {
    const { leadId } = useParams();
    const { getReminders, reminders, addReminder, removeReminder, editReminder } = useOverView();
    const leadData = useLeadDetails();
    const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
    const [selectedReminder, setSelectedReminder] = useState(null);

    useEffect(() => {
        getReminders(leadId);
    }, [getReminders, leadId]);

    const saveReminder = (payload) => {
        const addPayload = {
            ...payload,
            leadsId: leadId,
        };

        addReminder(addPayload);
        setIsAddNewModalOpen(false);
        setSelectedReminder(null);
    };

    const updateReminder = (payload, isComplete = false) => {
        const addPayload = {
            ...payload,
            leadsId: leadId,
            isComplete: isComplete,
        };
        editReminder(addPayload);
        setIsAddNewModalOpen(false);
        setSelectedReminder(null);
    };

    const deleteReminder = (id) => {
        removeReminder(id, leadId);
    };

    const remindersList = reminders?.filter((reminder) => !reminder?.isComplete);
    const sortedTasks = sortListByDate(remindersList, "reminderDate", true);

    return (
        <>
            <ContactSectionCard
                title="Reminders"
                infoIcon={remindersList && remindersList.length > 0 ? `(${remindersList.length})` : ""}
                className={styles.remindersContainer}
                isDashboard
                contentClassName={styles.remindersContainer_content}
                customStyle={styles.segregator}
                actions={
                    <div className="actions">
                        <OldButton
                            icon={<Plus />}
                            iconPosition="right"
                            label="Add New"
                            onClick={() => {
                                setIsAddNewModalOpen(true);
                            }}
                            type="tertiary"
                            className={styles.buttonWithIcon}
                        />
                    </div>
                }
            >
                {sortedTasks.length === 0 && (
                    <div className="no-items">
                        <span>This contact has no reminders.&nbsp;</span>
                        <button
                            className="link"
                            data-gtm={`button-add-${reminders}`}
                            onClick={() => {
                                setIsAddNewModalOpen(true);
                            }}
                        >
                            {" "}
                            Add a reminder
                        </button>
                    </div>
                )}
                <>
                    {sortedTasks?.map((reminder, index) => {
                        const {
                            reminderNote = "",
                            isComplete = false,
                            reminderId,
                            reminderDate,
                            reminderTitle,
                            reminderSource,
                        } = reminder;

                        const isOverDue = getOverDue(reminderDate) ? true : false;
                        return (
                            <Grid container className={styles.reminderInfoContainer} key={index}>
                                <Grid item md={2} xs={12}>
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
                                                    className={`${styles.dueValue} ${
                                                        isOverDue ? styles.overDueValue : ""
                                                    }`}
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
                                </Grid>

                                <Grid item md={8} xs={12}>
                                    <Box className={styles.reminderNotesInfo}>
                                        <Box>
                                            <Typography variant="h5" color="#052A63">
                                                {reminderTitle}
                                            </Typography>
                                        </Box>
                                        {reminderSource !== "Ask Integrity" ? (
                                            <Box className={styles.reminderDescription}>
                                                <Typography variant="body1" color="#434A51">
                                                    {reminderNote}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Box className={styles.reminderDescriptionAI}>
                                                <TextFormatter
                                                    inputText={reminderNote}
                                                    fontSize="16px"
                                                    color="#434A51"
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12}>
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
                                                        Complete
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
                                                            setIsAddNewModalOpen(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Box>
                                            </>
                                        )}
                                        <Box>
                                            <Button
                                                size="small"
                                                variant="text"
                                                color="primary"
                                                endIcon={<Delete color="#4178FF" />}
                                                onClick={() => deleteReminder(reminderId)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        );
                    })}
                </>
            </ContactSectionCard>
            {isAddNewModalOpen && (
                <AddReminderModal
                    open={isAddNewModalOpen}
                    onClose={() => {
                        setIsAddNewModalOpen(false);
                        setSelectedReminder(null);
                    }}
                    onSave={selectedReminder ? updateReminder : saveReminder}
                    leadId={leadId}
                    selectedReminder={selectedReminder}
                    leadData={leadData.leadDetails}
                />
            )}
        </>
    );
};
