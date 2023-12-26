import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import Modal from "components/Modal";

import styles from "./styles.module.scss";

function ActivePermissionModal({
    content,
    title,
    subTitle,
    isModalOpen,
    setIsModalOpen,
    actionButtonName,
    hideFooter = true,
    onSave,
}) {
    return (
        <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={title}
            size="wide"
            actionButtonName={actionButtonName}
            hideFooter={hideFooter}
            onSave={onSave}
        >
            <Box className={styles.modalContentHeader}>{subTitle}</Box>
            <Box className={styles.modalContent}>{content}</Box>
        </Modal>
    );
}

ActivePermissionModal.propTypes = {
    content: PropTypes.node,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    isModalOpen: PropTypes.bool,
    setIsModalOpen: PropTypes.func,
    actionButtonName: PropTypes.string,
    hideFooter: PropTypes.bool,
    onSave: PropTypes.func,
};

export default ActivePermissionModal;
