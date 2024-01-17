import * as Sentry from "@sentry/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import { Button, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

import phonesImage from "images/signup-phones.png";

import { formatPhoneNumber } from "utils/phones";

import useAgentInformationByID from "hooks/useAgentInformationByID";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

import Heading2 from "packages/Heading2";
import Heading3 from "packages/Heading3";
import Heading4 from "packages/Heading4";
import Modal from "packages/Modal";
import Paragraph from "packages/Paragraph";

import AppStore from "components/icons/appstore";
import PlayStore from "components/icons/playstore";

import clientsService from "services/clientsService";

import styles from "./styles.module.scss";

const StyledIconButton = styled(CloseIcon)(({ theme }) => ({
    cursor: "pointer",
    display: "flex",
    width: "16px",
    height: "16px",
    marginLeft: "auto",
    position: "absolute",
    right: 10,
    top: 10,
    color: "white",
}));

export default function GetStarted(props) {
    const leadPreference = props.leadPreference;
    const navigate = useNavigate();
    const [show, setShow] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const showToast = useToast();
    const {
        agentInformation: { agentVirtualPhoneNumber },
    } = useAgentInformationByID();
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
            setModalOpen(false);
        }
    };

    const navigateToAccount = () => {
        setModalOpen(false);
        navigate(`/account`);
    };

    const navigateToLearningCenter = () => {
        setModalOpen(false);
        navigate(`/learning-center`);
    };

    const modalContent = (
        <>
            <div className={styles.headingTitle}>
                <Heading3 id="transition-modal-title" text={"Welcome! It's time to get started."}></Heading3>
            </div>
            <div className={styles.subHeadingContent}>
                <Paragraph
                    id="transition-modal-subtitle"
                    text={
                        "Get access to leads real time, in person, online, or over the phone. Complete these steps to learn how!"
                    }
                ></Paragraph>
            </div>
            <div className={styles.modalBody}>
                <Heading4 id="transition-modal-description" text={"Integrity Number"}></Heading4>
                <Heading2
                    id="transition-modal-description"
                    text={formatPhoneNumber(agentVirtualPhoneNumber, true)}
                ></Heading2>
                <Paragraph
                    id="transition-modal-description"
                    text={
                        "This is your unique, recorded line. Forward it to the number you’d like to receive medicare leads."
                    }
                ></Paragraph>
                <Button onClick={navigateToAccount} variant="contained" sx={{ my: "0.5rem" }} size={"small"}>
                    View Account
                </Button>
                <Divider sx={{ width: "50%", my: "1rem" }} />

                <Heading4 id="transition-modal-description" text={"Set up LeadCENTER"}></Heading4>
                <Paragraph
                    id="transition-modal-description"
                    text={"Create lead campaigns and purchase real-time leads, all sent to you directly in Integrity."}
                ></Paragraph>
                <Button onClick={() => {}} variant="contained" sx={{ my: "0.5rem" }} size={"small"}>
                    LeadCENTER
                </Button>
                <Divider sx={{ width: "50%", my: "1rem" }} />

                <Heading4 id="transition-modal-description" text={"Complete Trainings"}></Heading4>
                <Paragraph
                    id="transition-modal-description"
                    text={
                        "Learn sales tips and tricks, how to use exiting new features available in Integrity, and more."
                    }
                ></Paragraph>
                <Button onClick={navigateToLearningCenter} variant="contained" sx={{ my: "0.5rem" }} size={"small"}>
                    Learning Center
                </Button>
                <Divider sx={{ width: "50%", my: "1rem" }} />

                <Heading4 id="transition-modal-description" text={"Download the Integrity App"}></Heading4>
                <Paragraph
                    id="transition-modal-description"
                    text={
                        "Check in to indicate when you’re ready to receive leads and receive real-time push notifications."
                    }
                ></Paragraph>
                <div className={styles.mobileApps}>
                    <div
                        onClick={() => {
                            /*  window.open("https://www.clients.integrity.com/", "_newtab"); */
                        }}
                    >
                        <PlayStore />
                    </div>
                    <div
                        onClick={() => {
                            /*  window.open("https://www.clients.integrity.com/", "_newtab"); */
                        }}
                    >
                        <AppStore />
                    </div>
                </div>
            </div>
        </>
    );

    if (!show) {
        return null;
    }

    return (
        <div className={styles.layout}>
            <StyledIconButton
                onClick={() => {
                    setShow(false);
                }}
            />
            <div className={styles.bannerImage}>
                <Box component="img" alt="The house from the offer." src={phonesImage} />
            </div>
            <div className={styles.bannerText}>
                <div className={styles.title}>Get access to leads — real time.</div>
                <Button
                    variant={"contained"}
                    size={"medium"}
                    onClick={() => {
                        setModalOpen(true);
                    }}
                    className={styles.button}
                >
                    Get Started
                </Button>
            </div>
            <Modal content={modalContent} open={modalOpen} handleClose={handleCloseModal} style={{ width: "552px" }} />
        </div>
    );
}
