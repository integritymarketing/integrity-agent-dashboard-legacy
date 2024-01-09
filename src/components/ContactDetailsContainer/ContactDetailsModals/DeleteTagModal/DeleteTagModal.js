import React from "react";

import { Box } from "@mui/system";

import Modal from "components/Modal";

import styles from "./DeleteTagModal.module.scss";

import { AddForward, Delete } from "../Icons";

export const DeleteTagModal = ({ onClose, open, onConfirm, label, body }) => {
    return (
        <Modal
            maxWidth="xs"
            open={open}
            onClose={onClose}
            onCancel={onClose}
            title={label}
            onSave={onConfirm}
            actionButtonName={label}
            endIcon={<AddForward color="#ffffff" />}
        >
            <Box className={styles.connectModalBody}>
                <div className={styles.deleteMessage}>{body}</div>
            </Box>
        </Modal>
    );
};
