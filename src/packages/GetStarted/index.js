import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import * as Sentry from "@sentry/react";
import AuthContext from "contexts/auth";
import Box from "@mui/material/Box";
import Modal from "packages/Modal";
import { Button, Typography, Divider } from "@mui/material";
import Heading3 from "packages/Heading3";
import Paragraph from "packages/Paragraph";
import Heading4 from "packages/Heading4";
import Heading2 from "packages/Heading2";
import PlayStore from "components/icons/playstore";
import AppStore from "components/icons/appstore";
import styles from "./styles.module.scss";
import clientService from "services/clientsService";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import { formatPhoneNumber } from "utils/phones";
import useToast from "hooks/useToast";
import phonesImage from "images/signup-phones.png";
import authService from "services/authService";
import useUserProfile from "hooks/useUserProfile";

export default function GetStarted() {
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const auth = useContext(AuthContext);
  const addToast = useToast();
  const agentInformation = useAgentInformationByID();
  const { agentVirtualPhoneNumber } = agentInformation;
  const userProfile = useUserProfile();
  const { npn } = userProfile;

  const handleCloseModal = async () => {
    const user = await auth.getUser();
    const { agentid } = user.profile;
    try {
      const payload = {
        agentId: agentid,
        leadPreference: {
          isAgentMobilePopUpDismissed: true,
        },
      };
      await clientService.updateAgentPreferences(payload);
    } catch (error) {
      addToast({
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
    history.push(`/account`);
  };

  const navigateToLearningCenter = () => {
    setModalOpen(false);
    history.push(`/learning-center`);
  };

  const modalContent = (
    <>
      <div className={styles.headingTitle}>
        <Heading3
          id="transition-modal-title"
          text={"Welcome! It's time to get started."}
        ></Heading3>
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
        <Heading4
          id="transition-modal-description"
          text={"MedicareCENTER Number"}
        ></Heading4>
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
        <Button
          onClick={navigateToAccount}
          variant="contained"
          sx={{ my: "0.5rem" }}
          size={"small"}
        >
          View Account
        </Button>
        <Divider sx={{ width: "50%", my: "1rem" }} />

        <Heading4
          id="transition-modal-description"
          text={"Set up LeadCENTER"}
        ></Heading4>
        <Paragraph
          id="transition-modal-description"
          text={
            "Create lead campaigns and purchase real-time leads, all sent to you directly in MedicareCENTER."
          }
        ></Paragraph>
        <Button
          onClick={() => authService.handleOpenLeadsCenter(npn)}
          variant="contained"
          sx={{ my: "0.5rem" }}
          size={"small"}
        >
          LeadCENTER
        </Button>
        <Divider sx={{ width: "50%", my: "1rem" }} />

        <Heading4
          id="transition-modal-description"
          text={"Complete Trainings"}
        ></Heading4>
        <Paragraph
          id="transition-modal-description"
          text={
            "Learn sales tips and trick, how to use exiting new features available in MedicareCENTER, and more."
          }
        ></Paragraph>
        <Button
          onClick={navigateToLearningCenter}
          variant="contained"
          sx={{ my: "0.5rem" }}
          size={"small"}
        >
          Learning Center
        </Button>
        <Divider sx={{ width: "50%", my: "1rem" }} />

        <Heading4
          id="transition-modal-description"
          text={"Download the MedicareCENTER App"}
        ></Heading4>
        <Paragraph
          id="transition-modal-description"
          text={
            "Check in to indicate when you’re ready to receive leads and receive real-time push notifications."
          }
        ></Paragraph>
        <div className={styles.mobileApps}>
          <div
            onClick={() => {
              /*  window.open("https://www.medicarecenter.com/", "_newtab"); */
            }}
          >
            <PlayStore />
          </div>
          <div
            onClick={() => {
              /*  window.open("https://www.medicarecenter.com/", "_newtab"); */
            }}
          >
            <AppStore />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.layout}>
      <div className={styles.bannerImage}>
        <Box
          component="img"
          alt="The house from the offer."
          src={phonesImage}
        />
      </div>
      <div className={styles.bannerText}>
        <Typography variant={"h5"} color={"white"}>
          Get access to leads — real time.
        </Typography>
        <Button
          variant={"contained"}
          size={"medium"}
          onClick={() => {
            setModalOpen(true);
          }}
          sx={{
            "text-transform": "capitalize",
            "&:hover": {
              background: "white",
              color: "#054CBC",
            },
          }}
        >
          Get Started
        </Button>
      </div>
      <Modal
        content={modalContent}
        open={modalOpen}
        handleClose={handleCloseModal}
        style={{ width: "552px" }}
      />
    </div>
  );
}
