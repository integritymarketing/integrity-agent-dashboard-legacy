import React, { useEffect } from "react";

import Box from "@mui/material/Box";

import useAgentInformationByID from "hooks/useAgentInformationByID";

import Modal from "components/Modal";
import OpenIcon from "components/icons/open";
import { Button } from "components/ui/Button";

import styles from "./styles.module.scss";

export default function AgentWelcomeDialog({ open, close, handleConfirm }) {
    const {
        agentInformation: { agentFirstName },
        getAgentAvailability,
    } = useAgentInformationByID();

    useEffect(() => {
        if (open && !agentFirstName) {
            getAgentAvailability();
        }
    }, [open, getAgentAvailability, agentFirstName]);

    const navigateToNewUserGuide = () => {
        window.open(`${process.env.REACT_APP_RESOURCES_URL}/Integrity-Getting-Started-Guide.pdf`, "_blank").focus();
        handleConfirm();
    };

    const navigateToReturningUserGuide = () => {
        window.open(`${process.env.REACT_APP_RESOURCES_URL}/Integrity-Whats-New.pdf`, "_blank").focus();
        handleConfirm();
    };

    const modalContent = (
        <>
            <Box className={styles.question}>
                <div className={styles.subHeader}>Just Registered?</div>
                <div className={styles.content}>
                    Find out how Integrity streamlines your business so you can save time and make more sales by
                    managing your Contacts.
                </div>
                <Box marginTop={"10px"}>
                    <Button
                        label={"New User Guide"}
                        className={styles.buttonWithIcon}
                        onClick={navigateToNewUserGuide}
                        type="primary"
                        icon={<OpenIcon />}
                        iconPosition="right"
                    />
                </Box>
            </Box>
            <Box
                className={styles.question}
                sx={{
                    borderTop: "1px solid #AAAAAA",
                }}
            >
                <div className={styles.subHeader}>Returning User?</div>
                <div className={styles.content}>
                    Integrity offers the same powerful features you already use to streamline your business, plus more
                    sales opportunities than ever before. Get up to speed quickly on what’s new and improved with
                    managing Contacts.
                </div>
                <Box marginTop={"10px"}>
                    <Button
                        label={"Returning User Guide"}
                        className={styles.buttonWithIcon}
                        onClick={navigateToReturningUserGuide}
                        type="primary"
                        icon={<OpenIcon />}
                        iconPosition="right"
                    />
                </Box>
            </Box>
        </>
    );

    return (
        <Modal maxWidth="sm" open={open} onClose={close} title={`Welcome, ${agentFirstName}!`} hideFooter>
            <Box className={styles.connectModalBody}>{modalContent}</Box>
        </Modal>
    );
}
