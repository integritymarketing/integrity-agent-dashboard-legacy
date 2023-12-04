import React, { createContext, useState, useCallback } from "react";
import useFetch from "hooks/useFetch";
import PropTypes from "prop-types";
import performAsyncOperation from "utilities/performAsyncOperation";
import useToast from "hooks/useToast";
export const OverViewContext = createContext();



export const OverViewProvider = ({ children }) => {
    const URL = `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Reminders`;

    const { Get: fetchReminders, loading: isLoadingReminders, error: remindersError, Post: saveReminder, Put: updateReminder, Delete: deleteReminder } = useFetch(URL);


    const showToast = useToast();
    const [reminders, setReminders] = useState([]);
    const [reminderLoading, setReminderLoading] = useState(false);


    const getReminders = useCallback(
        async (leadId) => {
            const data = await fetchReminders(null, false, leadId);
            setReminders(data || []); // TODO
        },
        [fetchReminders]
    );



    const addReminder = async (payload) => {
        await performAsyncOperation(
            () => saveReminder(payload),
            setReminderLoading,
            async () => {
                await getReminders(payload?.leadsId);
                showToast({
                    message: `Reminder added successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to Add reminders`,
                })
        );
    };

    const removeReminder = async (id, leadId) => {
        await performAsyncOperation(
            () => deleteReminder(null, false, id),
            setReminderLoading,
            async () => {
                await getReminders(leadId);
                showToast({
                    message: `Reminder deleted successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to delete reminders`,
                })
        );
    };

    const editReminder = async (payload) => {
        await performAsyncOperation(
            () => updateReminder(payload, false, payload?.reminderId),
            setReminderLoading,
            async () => {
                await getReminders(payload?.leadsId);
                showToast({
                    message: `Reminder updated successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to update reminders`,
                })
        );
    };



    return <OverViewContext.Provider value={getContextValue()}>{children}</OverViewContext.Provider>;

    function getContextValue() {
        return {
            getReminders,
            reminders,
            remindersError,
            isLoadingReminders,
            addReminder,
            editReminder,
            removeReminder,
        };
    }
};

OverViewProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
