import * as Sentry from "@sentry/react";
import React, { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Button } from "components/ui/Button";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

import phonesImage from "images/Laptop_Phone.png";

import AgentWelcomeDialog from "partials/agent-welcome-dialog";

import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

import clientsService from "services/clientsService";
import ArrowForwardWithCirlce from "./ArrowForwardWithCirlce";

import styles from "./styles.module.scss";

const StyledIconButton = styled(CloseIcon)(({ theme }) => ({
    cursor: "pointer",
    display: "flex",
    width: "26px",
    height: "26px",
    marginLeft: "auto",
    position: "absolute",
    right: 10,
    top: 10,
    color: "white",
}));

export default function GetStarted(props) {
    const leadPreference = props.leadPreference;
    const [show, setShow] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const showToast = useToast();

    const { agentId } = useUserProfile();

    const handleCloseModal = async () => {
        try {
            const payload = {
                agentId,
                leadPreference: {
                    ...leadPreference,
                    isAgentMobileBannerDismissed: true,
                },
            };
            await clientsService.updateAgentPreferences(payload);
        } catch (error) {
            showToast({
                type: "error",
                message: "Failed to Save the Preferences.",
                time: 10000,
            });
            Sentry.captureException(error);
        } finally {
            setShow(false);
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className={styles.layout}>
            <StyledIconButton onClick={handleCloseModal} />
            <div className={styles.bannerImage}>
                <Box component="img" alt="The house from the offer." src={phonesImage} />
            </div>
            <div className={styles.bannerText}>
                <div className={styles.title1}>Welcome to Integrity</div>
                <div className={styles.title2}>
                    Manage your entire client workflow, from client history to quoting and applications
                </div>
            </div>
            <Box className={styles.bannerButton}>
                <Button
                    icon={<ArrowForwardWithCirlce />}
                    label={"Learn More"}
                    className={styles.buttonWithIcon}
                    onClick={() => {
                        setModalOpen(true);
                    }}
                    type="tertiary"
                    iconPosition="right"
                />
            </Box>

            {modalOpen && (
                <AgentWelcomeDialog
                    open={modalOpen}
                    handleConfirm={() => setModalOpen(false)}
                    close={() => setModalOpen(false)}
                />
            )}
        </div>
    );
}