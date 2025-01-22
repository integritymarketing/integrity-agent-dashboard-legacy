import { Box, Button } from "@mui/material";

import PropTypes from "prop-types";

import Modal from "components/Modal";
import ButtonCircleArrow from "components/icons/button-circle-arrow";

import styles from "./FinalExpenseContactDetailsForm.module.scss";

import {
    BENEFITS_SELLING_PERMISSIONS,
    CONTINUE_QUOTE,
    UPDATE_PERMISSIONS,
    UPDATE_SELLING_PERMISSIONS_SUBTEXT,
    UPDATE_SELLING_PERMISSIONS_TEXT,
} from "../FinalExpensePlansContainer.constants";

export const SellingPermissionsModal = ({ showSellingPermissionModal, handleModalClose, handleContinue }) => {
    const redirectToAccount = () => {
        window.location.href = `${import.meta.env.VITE_AUTH_PAW_REDIRECT_URI}/selling-permissions`;
    };

    return (
        <Modal
            open={showSellingPermissionModal}
            onClose={handleModalClose}
            hideFooter
            title={UPDATE_SELLING_PERMISSIONS_TEXT}
            titleClassName={styles.modalTitle}
        >
            <div className={styles.modalContainer}>{UPDATE_SELLING_PERMISSIONS_SUBTEXT}</div>
            <div className={styles.contentBox}>
                <div>{`Updating your Selling Permissions on the `}</div>
                <div>
                    <span className={styles.redirectLink} onClick={redirectToAccount}>
                        {"Account screen"}
                    </span>
                    {` helps you to:`}
                </div>
                <ul className={styles.helpList}>
                    {BENEFITS_SELLING_PERMISSIONS.map((text) => (
                        <li>{text}</li>
                    ))}
                </ul>
                <Box className={styles.footerButtons}>
                    <Button onClick={handleContinue} className={styles.cancelCTA}>
                        {CONTINUE_QUOTE}
                    </Button>
                    <Button
                        onClick={redirectToAccount}
                        className={styles.updatePermissionCTA}
                        endIcon={<ButtonCircleArrow />}
                    >
                        {UPDATE_PERMISSIONS}
                    </Button>
                </Box>
            </div>
        </Modal>
    );
};

SellingPermissionsModal.propTypes = {
    showSellingPermissionModal: PropTypes.bool.isRequired,
    handleModalClose: PropTypes.func.isRequired,
    handleContinue: PropTypes.func.isRequired,
};
