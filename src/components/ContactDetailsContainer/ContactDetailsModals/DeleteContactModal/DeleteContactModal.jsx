import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/system";

import { useLeadDetails } from "providers/ContactDetails";

import Modal from "components/Modal";

import DeleteLeadContext from "contexts/deleteLead";

import styles from "./DeleteContactModal.module.scss";

import { Delete } from "../Icons";

export const DeleteContactModal = ({ leadId, leadName, onClose, open }) => {
    const { removeContact } = useLeadDetails();

    const { setDeleteLeadId, setLeadName } = useContext(DeleteLeadContext);
    const navigate = useNavigate();

    const callBack = () => {
        setDeleteLeadId(leadId);
        setLeadName(leadName);
        navigate("/contacts");
    };

    const deleteLead = () => {
        removeContact(leadId, callBack);
    };

    return (
        <Modal
            maxWidth="xs"
            open={open}
            onClose={onClose}
            onCancel={onClose}
            title="Delete Contact"
            onSave={deleteLead}
            actionButtonName="Delete"
            endIcon={<Delete color="#ffffff" />}
        >
            <Box className={styles.connectModalBody}>
                <div className={styles.deleteMessage}>Are you sure you want to delete this contact? </div>
            </Box>
        </Modal>
    );
};
