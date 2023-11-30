import React, { useContext } from "react";
import Modal from "components/Modal";
import { Box } from "@mui/system";
import DeleteLeadContext from "contexts/deleteLead";
import { useNavigate } from "react-router-dom";
import { useLeadDetails } from "providers/ContactDetails";
import { Delete } from "../Icons";

import styles from "./DeleteContactModal.module.scss";

export const DeleteContactModal = ({
    leadId,
    leadName,
    onClose,
    open,
}) => {
    const { removeContact } = useLeadDetails();

    const { setDeleteLeadId, setLeadName } = useContext(DeleteLeadContext);
    const navigate = useNavigate();

    const deleteLead = async () => {
        await removeContact(leadId);
        setDeleteLeadId(leadId);
        setLeadName(leadName);
        navigate("/contacts-list");
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

                <div className={styles.deleteMessage} >Are you sure you want to delete this contact? </div>

            </Box>
        </Modal>

    );
};

