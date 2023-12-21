import React, { createContext, useState, useCallback } from "react";
import useFetch from "hooks/useFetch";
import PropTypes from "prop-types";
import performAsyncOperation from "utilities/performAsyncOperation";
import useToast from "hooks/useToast";

export const OverViewContext = createContext();

export const OverViewProvider = ({ children }) => {
    const URL = `${process.env.REACT_APP_LEADS_URL}/api/v2.0`;

    const { Get: fetchReminders, loading: isLoadingReminders, error: remindersError, Post: saveReminder, Put: updateReminder, Delete: deleteReminder } = useFetch(URL);
    const { Get: fetchLeadTags, loading: isLoadingTags, error: tagsError, Post: updateLeadTags, Delete: deleteLeadTags, } = useFetch(URL);
    const { Put: updateTag, Post: addNewTag } = useFetch(URL);

    const showToast = useToast();
    const [reminders, setReminders] = useState([]);
    const [tags, setTags] = useState([]);

    const getReminders = useCallback(
        async (leadId) => {
            const path = `Reminders/${leadId}`
            const data = await fetchReminders(null, false, path);
            setReminders(data || []);
        },
        [fetchReminders]
    );

    const getLeadTags = useCallback(async () => {
        const path = `Tag/TagsGroupByCategory`
        const data = await fetchLeadTags(null, false, path);
        setTags(data || []);
    }, [fetchLeadTags]);

    const editLeadTags = async (payload) => {
        const path = `LeadTags/Update`
        await performAsyncOperation(
            () => updateLeadTags(payload, false, path),
            () => { },
            async () => {
                await getLeadTags();
                showToast({
                    message: `Tags updated successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to update Tags`,
                })
        );
    };

    const createNewTag = async (payload, selectedTags) => {
        const path = `Tag/`
        await performAsyncOperation(
            async () => await addNewTag(payload, false, path),
            () => { },
            async (data) => {
                const newTag = data?.tagId;
                if (newTag) {
                    const editPayload = {
                        leadId: payload?.leadsId,
                        tagIds: [...selectedTags, newTag]
                    }
                    await editLeadTags(editPayload)
                } else {
                    getLeadTags();
                }

                showToast({
                    message: `Tag updated successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to update Tag`,
                })
        );
    };

    const editTagByID = async (payload) => {
        const path = `Tag/${payload.tagId}`
        await performAsyncOperation(
            () => updateTag(payload, true, path),
            () => { },
            async () => {
                await getLeadTags();
                showToast({
                    message: `Tag updated successfully`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to update Tag`,
                })
        );
    };

    const removeLeadTags = async (id) => {
        const path = `Tag/${id}`
        await performAsyncOperation(
            () => deleteLeadTags(null, true, path),
            () => { },
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
                })
        );
    };

    const addReminder = async (payload) => {
        const path = `Reminders`
        await performAsyncOperation(
            () => saveReminder(payload, false, path),
            () => { },
            async () => {
                await getReminders(payload?.leadsId);
                showToast({
                    message: `Reminder added successfully`,
                });
            },
            () =>
                showToast({
                    type: "error",
                    message: `Failed to Add reminders`,
                })
        );
    };

    const removeReminder = async (id, leadId) => {
        const path = `Reminders/${id}`
        await performAsyncOperation(
            () => deleteReminder(null, true, path),
            () => { },
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
                })
        );
    };

    const editReminder = async (payload) => {
        const path = `Reminders/${payload?.leadsId}`
        await performAsyncOperation(
            () => updateReminder(payload, false, path),
            () => { },
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
            getLeadTags,
            tags,
            isLoadingTags,
            tagsError,
            editLeadTags,
            removeLeadTags,
            editTagByID,
            createNewTag
        };
    }
};

OverViewProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
