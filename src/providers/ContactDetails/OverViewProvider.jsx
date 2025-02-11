import { createContext, useCallback, useState } from "react";

import PropTypes from "prop-types";
import { useLeadDetails } from "providers/ContactDetails";
import performAsyncOperation from "utilities/performAsyncOperation";

import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";

export const OverViewContext = createContext();

export const OverViewProvider = ({ children }) => {
    const { getLeadDetails } = useLeadDetails();
    const URL = `${import.meta.env.VITE_LEADS_URL}/api/v2.0`;

    const {
        Get: fetchReminders,
        loading: isLoadingReminders,
        error: remindersError,
        Post: saveReminder,
        Put: updateReminder,
        Delete: deleteReminder,
    } = useFetch(URL);
    const {
        Get: fetchLeadTags,
        loading: isLoadingTags,
        error: tagsError,
        Post: updateLeadTags,
        Delete: deleteLeadTags,
    } = useFetch(URL);
    const { Put: updateTag, Post: addNewTag } = useFetch(URL);

    const {
        loading: isLoadingActivities,
        Put: updateActivity,
        Post: saveActivity,
        Delete: deleteActivity,
    } = useFetch(URL);

    const showToast = useToast();
    const [reminders, setReminders] = useState([]);
    const [tags, setTags] = useState([]);

    const getReminders = useCallback(
        async (leadId) => {
            const path = `Reminders/${leadId}`;
            const data = await fetchReminders(null, false, path);
            setReminders(data || []);
        },
        [fetchReminders],
    );

    const getLeadTags = useCallback(async () => {
        const path = `Tag/TagsGroupByCategory`;
        const data = await fetchLeadTags(null, true, path);
        if (data.ok) {
            const response = await data.json();
            setTags(response || []);
        }
    }, [fetchLeadTags]);

    const editLeadTags = async (payload) => {
        const path = `LeadTags/Update`;
        await performAsyncOperation(
            () => updateLeadTags(payload, false, path),
            () => {},
            async () => {
                await getLeadTags();
                await getLeadDetails(payload?.leadId);
                showToast({
                    message: `Tags updated successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to update Tags`,
                }),
        );
    };

    const createNewTag = async (payload, selectedTags) => {
        const path = `Tag`;
        await performAsyncOperation(
            async () => await addNewTag(payload, false, path),
            () => {},
            async () => {
                await getLeadTags();
                await getLeadDetails(payload?.leadsId);
                showToast({
                    message: `Tag Created successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to update Tag`,
                }),
        );
    };

    const editTagByID = async (payload) => {
        const path = `Tag/${payload.tagId}`;
        await performAsyncOperation(
            () => updateTag(payload, true, path),
            () => {},
            async () => {
                await getLeadTags();
                await getLeadDetails(payload?.leadsId);
                showToast({
                    message: `Tag updated successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to update Tag`,
                }),
        );
    };

    const removeLeadTags = async (id) => {
        const path = `Tag/${id}`;
        await performAsyncOperation(
            () => deleteLeadTags(null, true, path),
            () => {},
            async () => {
                await getLeadTags();
                showToast({
                    message: `Tag deleted successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to delete Tag`,
                }),
        );
    };

    const addActivity = async (payload) => {
        const path = `Activities`;
        await performAsyncOperation(
            () => saveActivity(payload, false, path),
            () => {},
            async () => {
                await getLeadDetails(payload?.leadsId);
                showToast({
                    type: "success",
                    message: "Activity successfully added.",
                    time: 3000,
                });
            },
            () =>
                showToast({
                    type: "error",
                    message: `Failed to Add Activity`,
                }),
        );
    };

    const removeActivity = async (id, leadId) => {
        const path = `Activities/${id}`;

        await performAsyncOperation(
            () => deleteActivity(null, true, path),
            () => {},
            async () => {
                await getLeadDetails(leadId);
                showToast({
                    message: `Activity deleted successfully`,
                });
            },
            () =>
                showToast({
                    type: "error",
                    message: `Failed to delete Activity`,
                }),
        );
    };

    const editActivity = async (activity, activityNote, leadId) => {
        const payload = {
            ...activity,
            activityNote,
        };
        const path = `Activities/${leadId}`;
        await performAsyncOperation(
            () => updateActivity(payload, false, path),
            () => {},
            async () => {
                await getLeadDetails(leadId);
                showToast({
                    message: `Activity updated successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to update Activity`,
                }),
        );
    };

    const addActivityNotes = async (activity, activityNote, leadId) => {
        const path = `Activities/${leadId}`;
        const payload = {
            ...activity,
            activityNote,
        };
        await performAsyncOperation(
            () => updateActivity(payload, false, path),
            () => {},
            async () => {
                await getLeadDetails(leadId);
                showToast({
                    message: `Activity updated successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to update Activity`,
                }),
        );
    };

    const addReminder = async (payload, refreshCallback) => {
        const path = `Reminders`;
        await performAsyncOperation(
            () => saveReminder(payload, false, path),
            () => {},
            async () => {
                await getReminders(payload?.leadsId);
                refreshCallback && refreshCallback();
                showToast({
                    message: `Reminder added successfully`,
                });
            },
            () =>
                showToast({
                    type: "error",
                    message: `Failed to Add reminders`,
                }),
        );
    };

    const removeReminder = async (id, leadId) => {
        const path = `Reminders/${id}`;
        await performAsyncOperation(
            () => deleteReminder(null, true, path),
            () => {},
            async () => {
                await getReminders(leadId);
                showToast({
                    message: `Reminder deleted successfully`,
                });
            },
            () =>
                showToast({
                    type: "error",
                    message: `Failed to delete reminders`,
                }),
        );
    };

    const editReminder = async (payload, refreshCallback) => {
        const path = `Reminders/${payload?.leadsId}`;
        await performAsyncOperation(
            () => updateReminder(payload, false, path),
            () => {},
            async () => {
                await getReminders(payload?.leadsId);
                refreshCallback && refreshCallback();
                showToast({
                    message: `Reminder updated successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to update reminders`,
                }),
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
            getLeadTags,
            tags,
            isLoadingTags,
            tagsError,
            editLeadTags,
            removeLeadTags,
            editTagByID,
            createNewTag,
            addActivity,
            removeActivity,
            editActivity,
            addActivityNotes,
            isLoadingActivities,
        };
    }
};

OverViewProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
