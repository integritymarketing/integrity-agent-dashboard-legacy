import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import { useLeadDetails, useOverView } from "providers/ContactDetails";
import ContactSectionCard from "packages/ContactSectionCard";
import { Button } from "components/ui/Button";
import { Delete, Edit, Complete, } from "../../Icons";
import Reminder from "../../Icons/reminder";
import Plus from "components/icons/plus";
import EditIcon from "components/icons/icon-edit";
import { getDateTime, getOverDue } from "utils/dates";

import styles from "./RemindersList.module.scss";
import { AddReminderModal } from "components/ContactDetailsContainer/ContactDetailsModals/AddReminderModal/AddReminderModal";
export const RemindersList = () => {
    const { leadId } = useParams();

    const { leadDetails } = useLeadDetails();
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
        }
        addReminder(addPayload, leadId);
        setIsAddNewModalOpen(false);
    }

    const updateReminder = (payload, isComplete = false) => {
        const addPayload = {
            ...payload,
            leadsId: leadId,
            isComplete: isComplete
        }
        editReminder(addPayload);
        setIsAddNewModalOpen(false);
    }



    const deleteReminder = (id) => {
        removeReminder(id);
    }





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
                                setIsAddNewModalOpen(true)
                            }}
                            type="tertiary"
                            className={styles.buttonWithIcon}
                        />
                    </div>
                }
            >
                <>
                    {reminders?.map((reminder) => {
                        const { reminderNote = "", isComplete = false, reminderId, reminderDate } = reminder;
                        const isOverDue = getOverDue(reminderDate) ? true : false;
                        return (
                            <Box className={styles.reminderItem}>
                                <Box className={styles.reminderDue}>
                                    <Box className={`${styles.reminderIcon} ${isOverDue ? styles.dueIcon : ""}`}> {isOverDue ? <Reminder color="#FF1717" /> : <Reminder color="#4178FF" />}</Box>
                                    <Box>
                                        <Box className={styles.dueLabel}>Due:{" "} <span className={styles.dueValue}>{getDateTime(reminderDate)?.date}</span></Box>
                                        <Box className={styles.dueLabel}>At: {" "} <span className={styles.dueValue}>{getDateTime(reminderDate)?.time}</span></Box>
                                    </Box>
                                </Box>
                                <Box className={styles.reminderDescription}>{reminderNote}</Box>
                                <Box className={styles.reminderActions}>
                                    {!isComplete &&
                                        <>
                                            <div>
                                                <Button
                                                    icon={<Complete color="#4178FF" />}
                                                    label={"Complete"}
                                                    className={styles.buttonWithIcon}
                                                    onClick={() => updateReminder(reminder, true)}
                                                    type="tertiary"
                                                    iconPosition="right"
                                                />
                                            </div>

                                            <div className={styles.editButton}>
                                                <Button
                                                    icon={<EditIcon />}
                                                    label={"Edit"}
                                                    className={styles.buttonWithIcon}
                                                    onClick={() => {
                                                        setSelectedReminder(reminder)
                                                        setIsAddNewModalOpen(true)
                                                    }}
                                                    type="tertiary"
                                                    iconPosition="right"
                                                />
                                            </div>
                                        </>
                                    }
                                    <div>
                                        <Button
                                            icon={<Delete color="#4178FF" />}
                                            label={"Delete"}
                                            className={styles.buttonWithIcon}
                                            onClick={() => deleteReminder(reminderId)}
                                            type="tertiary"
                                            iconPosition="right"
                                        />
                                    </div>
                                </Box>
                            </Box>
                        );
                    })}

                </>
            </ContactSectionCard >
            {
                isAddNewModalOpen &&
                <AddReminderModal
                    open={isAddNewModalOpen}
                    onClose={() => setIsAddNewModalOpen(false)}
                    onSave={selectedReminder ? updateReminder : saveReminder}
                    leadId={leadId}
                    selectedReminder={selectedReminder} />
            }
        </>
    );
};



