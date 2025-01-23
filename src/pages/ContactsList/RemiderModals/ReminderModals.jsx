import { useCallback, useState } from "react";
import { AddReminderModal } from "components/ContactDetailsContainer/ContactDetailsModals/AddReminderModal/AddReminderModal";
import ReminderList from "./ReminderList/ReminderList";
import { useOverView } from "providers/ContactDetails";
import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";
import PropTypes from "prop-types";

const RemindersModals = ({
    isMobile,
    showAddReminderModal,
    showRemindersListModal,
    setShowAddReminderModal,
    setShowRemindersListModal,
    leadData,
    view,
}) => {
    const { addReminder, editReminder } = useOverView();
    const { refreshData } = useContactsListContext();
    const [selectedReminder, setSelectedReminder] = useState(null);

    const saveReminder = useCallback(
        (payload) => {
            const data = { ...payload, leadsId: leadData?.leadsId };
            addReminder(data, refreshData);
            setShowAddReminderModal(false);
            setSelectedReminder(null);
        },
        [addReminder, leadData?.leadsId, refreshData, setShowAddReminderModal]
    );

    const updateReminder = useCallback(
        (payload, isComplete = false) => {
            const addPayload = { ...payload, leadsId: leadData?.leadsId, isComplete };
            editReminder(addPayload, refreshData);
            setShowAddReminderModal(false);
            setShowRemindersListModal(false);
            setSelectedReminder(null);
        },
        [editReminder, leadData?.leadsId, refreshData, setShowAddReminderModal]
    );

    return (
        <>
            {showAddReminderModal && (
                <AddReminderModal
                    open={showAddReminderModal}
                    onClose={() => {
                        setSelectedReminder(null);
                        setShowAddReminderModal(false);
                    }}
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
                    view={view}
                    updateReminder={updateReminder}
                />
            )}
        </>
    );
};

RemindersModals.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    showAddReminderModal: PropTypes.bool.isRequired,
    showRemindersListModal: PropTypes.bool.isRequired,
    setShowAddReminderModal: PropTypes.func.isRequired,
    setShowRemindersListModal: PropTypes.func.isRequired,
    leadData: PropTypes.shape({
        leadsId: PropTypes.number,
        reminders: PropTypes.array,
    }).isRequired,
    view: PropTypes.string.isRequired,
};

export default RemindersModals;
