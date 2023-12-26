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
                        <li>Filter the Quote results by the Products and Carriers you are contracted with</li>
                        <li>Gain Single Sign On to select Carriers and Product Websites</li>
                        <li>Automatically link Final Expense Policies to your Account</li>
                    </ul>
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
