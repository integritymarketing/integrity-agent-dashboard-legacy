import React from "react";
import Modal from "components/Modal";
import { Box } from "@mui/system";

import { Delete } from "../Icons";

import styles from "./DeleteTagModal.module.scss";

export const DeleteTagModal = ({
    onClose,
    open,
    onConfirm,
}) => {


    return (
        <Modal
            maxWidth="xs"
            open={open}
            onClose={onClose}
            onCancel={onClose}
            title="Delete Tag"
            onSave={onConfirm}
            actionButtonName="Delete"
            endIcon={<Delete color="#ffffff" />}
        >
            <Box className={styles.connectModalBody}>

                <div className={styles.deleteMessage} >Are you sure you want to delete this tag? </div>

            </Box>
        </Modal>

    );
};

