import React from "react";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import SAPermissionModal from "./SAPermissionModal";
import styles from "./styles.module.scss";

function LifeInfoModal({ isModalOpen, setIsModalOpen }) {
    return (
        <SAPermissionModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            title="Life Self-Attestation"
            subTitle="Final Expense"
            content={
                <>
                    <Box>Updating your Selling Permissions for Final Expense helps you to:</Box>
                    <ul className={styles.listStyle}>
                        <li>Filter the Quote results by the Products and Carriers you’re contracted with</li>
                        <li>Use Single Sign On and Application Pre-Fill for select carrier and product websites</li>
                        <li>Automatically link Final Expense Policies to your Clients in Contact Management</li>
                    </ul>
                    <div className={styles.needHelpTitle}>Need Help?</div>
                    <div className={styles.needHelpSubTitle}>To find your Producer ID / Agent Writing Number, please contact your carrier and/or upline.</div>
                    <div>Self-attested permissions expire after 33 days if they’re not verified. For questions about expired permissions, please contact your upline.</div>
                </>
            }
        />
    );
}

LifeInfoModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
};

export default LifeInfoModal;
