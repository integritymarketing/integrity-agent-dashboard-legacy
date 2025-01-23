import React from "react";

import { Typography } from "@mui/material";

import Heading3 from "packages/Heading3";
import Modal from "packages/Modal";

import styles from "./styles.module.scss";

export const NonRTSModal = ({ modalOpen, handleClose }) => {
    const modalContent = () => {
        return (
            <>
                <Heading3 text="Access Pending" />

                <div className={styles.lowerSectionModal}>
                    <Typography id="transition-modal-description" sx={{ p: "16px" }} color={"#434A51"}>
                        Access to Integrity is not available until we receive your carrier appointment information.
                        Please contact your marketer with any questions.
                    </Typography>
                </div>
            </>
        );
    };

    return <Modal content={modalContent()} open={modalOpen} handleClose={() => handleClose()} />;
};
