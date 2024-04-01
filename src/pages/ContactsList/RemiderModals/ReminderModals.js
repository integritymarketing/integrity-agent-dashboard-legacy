import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddReminderModal } from "components/ContactDetailsContainer/ContactDetailsModals/AddReminderModal/AddReminderModal";
import ReminderList from "./ReminderList/ReminderList";
import { useOverView } from "providers/ContactDetails";

const RemindersModals = ({
    isMobile,
    showAddReminderModal,
    showRemindersListModal,
    setShowAddReminderModal,
    setShowRemindersListModal,
    leadData,
}) => {
    const { addReminder, editReminder } = useOverView();
    const [selectedReminder, setSelectedReminder] = useState(null);

    const saveReminder = (payload) => {
        addReminder(payload, leadId);
        setShowAddReminderModal(false);
        setSelectedReminder(null);
    };

    const updateReminder = (payload, isComplete = false) => {
        const addPayload = {
            ...payload,
            leadsId: leadId,
            isComplete: isComplete,
        };
        editReminder(addPayload);
        setShowAddReminderModal(false);
        setSelectedReminder(null);
    };
    return (
        <>
            {showAddReminderModal && (
                <AddReminderModal
                    open={showAddReminderModal}
                    onClose={() => setShowAddReminderModal(false)}
                    onSave={selectedReminder ? updateReminder : saveReminder}
                    leadId={leadData?.leadsId}
                    selectedReminder={selectedReminder}
                    leadData={leadData}
                    showLink={true}
                />
            )}
            {showRemindersListModal && (
                <ReminderList
                    open={showRemindersListModal}
                    onClose={() => setShowRemindersListModal(false)}
                    reminders={leadData?.reminders}
                    leadData={leadData}
                    setSelectedReminder={setSelectedReminder}
                    setShowEditReminderModal={setShowAddReminderModal}
                />
            )}
        </>
    );
};

export default RemindersModals;
