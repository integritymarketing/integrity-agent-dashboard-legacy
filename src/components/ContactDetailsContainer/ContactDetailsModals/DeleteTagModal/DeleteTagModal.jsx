import PropTypes from "prop-types";

import { Box } from "@mui/system";

import Modal from "components/Modal";

import styles from "./DeleteTagModal.module.scss";

import { AddForward } from "../Icons";

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

DeleteTagModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
};
