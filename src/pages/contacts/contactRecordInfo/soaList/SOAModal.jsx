import React from "react";
import PropTypes from "prop-types";
import Modal from "components/Modal";
import NewScopeOfAppointment from "../newScopeOfAppointment";

/**
 * Modal component to manage the Scope of Appointment.
 *
 * @param {Object} props Component props
 * @param {string} props.id Identifier for the lead.
 * @param {boolean} props.openSOAModal State to control the visibility of the modal.
 * @param {Function} props.setOpenSOAModal Function to update the visibility state of the modal.
 * @param {Function} props.refreshSOAList Function to refresh the list of SOAs.
 */

const SOAModal = ({ id, openSOAModal, setOpenSOAModal, refreshSOAList }) => {
    const handleClose = () => setOpenSOAModal(false);

    return (
        <Modal
            open={openSOAModal}
            onClose={handleClose}
            hideFooter
            contentStyle={{ padding: "0", borderRadius: "0px 0px 8px 8px" }}
            title="Send Scope Of Appointment"
        >
            <NewScopeOfAppointment leadId={id} onCloseModal={handleClose} refreshSOAList={refreshSOAList} />
        </Modal>
    );
};

SOAModal.propTypes = {
    id: PropTypes.string.isRequired,
    openSOAModal: PropTypes.bool.isRequired,
    setOpenSOAModal: PropTypes.func.isRequired,
    refreshSOAList: PropTypes.func.isRequired,
};

export default React.memo(SOAModal);
