import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddReminderModal } from "components/ContactDetailsContainer/ContactDetailsModals/AddReminderModal/AddReminderModal";
import ReminderList from "./ReminderList/ReminderList";
import { useOverView } from "providers/ContactDetails";
import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

const RemindersModals = ({
    isMobile,
    showAddReminderModal,
    showRemindersListModal,
    setShowAddReminderModal,
    setShowRemindersListModal,
    leadData,
}) => {
    const { addReminder, editReminder } = useOverView();
    const { refreshData } = useContactsListContext();

    const [selectedReminder, setSelectedReminder] = useState(null);

    const saveReminder = (payload) => {
        let data = {
            ...payload,
            leadsId: leadData?.leadsId,
        };

        addReminder(data, refreshData);
        setShowAddReminderModal(false);
        setSelectedReminder(null);
    };

    const updateReminder = (payload, isComplete = false) => {
        const addPayload = {
            ...payload,
            leadsId: leadData?.leadsId,
            isComplete: isComplete,
        };
        editReminder(addPayload, refreshData);
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
                    isMobile={isMobile}
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
                    isMobile={isMobile}
                />
            )}
        </>
    );
};

export default RemindersModals;
