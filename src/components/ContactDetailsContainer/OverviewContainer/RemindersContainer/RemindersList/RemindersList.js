import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";

import { useOverView } from "providers/ContactDetails";

import { formatDate, getDateTime, getOverDue } from "utils/dates";

import ContactSectionCard from "packages/ContactSectionCard";

import { AddReminderModal } from "components/ContactDetailsContainer/ContactDetailsModals/AddReminderModal/AddReminderModal";
import EditIcon from "components/icons/icon-edit";
import Plus from "components/icons/plus";
import { Button } from "components/ui/Button";

import styles from "./RemindersList.module.scss";

import { Complete, Delete } from "../../Icons";
import Reminder from "../../Icons/reminder";

export const RemindersList = () => {
    const { leadId } = useParams();
    const { getReminders, reminders, addReminder, removeReminder, editReminder } = useOverView();
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
        addReminder(addPayload, leadId);
        setIsAddNewModalOpen(false);
    };

    const updateReminder = (payload, isComplete = false) => {
        const addPayload = {
            ...payload,
            leadsId: leadId,
            isComplete: isComplete,
            
        };
        editReminder(addPayload);
        setIsAddNewModalOpen(false);
    };

    const deleteReminder = (id) => {
        removeReminder(id, leadId);
    };

    const remindersList = reminders?.filter((reminder) => !reminder?.isComplete);

    return (
        <>
            <ContactSectionCard
                title="Reminders"
                infoIcon={`(${reminders?.length})`}
                className={styles.remindersContainer}
                isDashboard
                contentClassName={styles.remindersContainer_content}
                actions={
                    <div className="actions">
                        <Button
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
                <>
                    {remindersList?.map((reminder) => {
                        const { reminderNote = "", isComplete = false, reminderId, reminderDate } = reminder;
                        const isOverDue = getOverDue(reminderDate) ? true : false;
                        return (
                            <Box className={styles.reminderItem}>
                                <Box className={styles.reminderDue}>
                                    <Box className={`${styles.reminderIcon} ${isOverDue ? styles.dueIcon : ""}`}>
                                        {isOverDue ? <Reminder color="#FF1717" /> : <Reminder color="#4178FF" />}
                                    </Box>
                                    <Box>
                                        <Box className={styles.dueLabel}>
                                            Due:
                                            <span className={styles.dueValue}>{formatDate(reminderDate, "MM/dd")}</span>
                                        </Box>
                                        <Box className={styles.dueLabel}>
                                            At:
                                            <span className={styles.dueValue}>{getDateTime(reminderDate)?.time}</span>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className={styles.reminderDescription}>{reminderNote}</Box>
                                <Box className={styles.reminderActions}>
                                    {!isComplete && (
                                        <>
                                            <Box>
                                                <Button
                                                    icon={<Complete color="#4178FF" />}
                                                    label={"Complete"}
                                                    className={styles.buttonWithIcon}
                                                    onClick={() => updateReminder(reminder, true)}
                                                    type="tertiary"
                                                    iconPosition="right"
                                                />
                                            </Box>
                                            <Box className={styles.editButton}>
                                                <Button
                                                    icon={<EditIcon />}
                                                    label={"Edit"}
                                                    className={styles.buttonWithIcon}
                                                    onClick={() => {
                                                        setSelectedReminder(reminder);
                                                        setIsAddNewModalOpen(true);
                                                    }}
                                                    type="tertiary"
                                                    iconPosition="right"
                                                />
                                            </Box>
                                        </>
                                    )}
                                    <Box>
                                        <Button
                                            icon={<Delete color="#4178FF" />}
                                            label={"Delete"}
                                            className={styles.buttonWithIcon}
                                            onClick={() => deleteReminder(reminderId)}
                                            type="tertiary"
                                            iconPosition="right"
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </>
            </ContactSectionCard>
            {isAddNewModalOpen && (
                <AddReminderModal
                    open={isAddNewModalOpen}
                    onClose={() => {
                        setIsAddNewModalOpen(false) 
                        setSelectedReminder(null)}
                    }
                    onSave={selectedReminder ? updateReminder : saveReminder}
                    leadId={leadId}
                    selectedReminder={selectedReminder}
                />
            )}
        </>
    );
};
