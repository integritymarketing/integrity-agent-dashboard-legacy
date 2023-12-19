import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "packages/Modal";
import Heading2 from "packages/Heading2";
import Heading3 from "packages/Heading3";
import Paragraph from "packages/Paragraph";
import Heading4 from "packages/Heading4";
import { Divider } from "@mui/material";
import { Button } from "packages/Button";
import Hyperlink from "packages/Hyperlink";
import { formatTwiloNumber } from "utils/formatTwiloNumber";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import styles from "./styles.module.scss";

export default function AgentWelcomeDialog({ open, close, handleConfirm }) {
  const navigate = useNavigate();
  const {
    agentInformation: { agentFirstName, agentVirtualPhoneNumber },
    getAgentAvailability,
  } = useAgentInformationByID();

  useEffect(() => {
    if (open) {
      getAgentAvailability();
    }
  }, [open, getAgentAvailability]);
  const navigateToLearningPage = () => {
    navigate(`/learning-center`);
  };

  const navigateToAccountPage = () => {
    navigate(`/account`);
  };

  const navigateToHelpPage = () => {
    navigate(`/help`);
  };

  const modalContent = (
    <>
      <div className={styles.headingTitle}>
        <Heading3
          id="transition-modal-title"
          text={`Welcome, ${agentFirstName}!`}
        />
      </div>
      <div className={styles.subHeadingContent}>
        <Paragraph
          id="transition-modal-subtitle"
          text={
            "Integrity Clients now provides free, compliant, and automatic call recording and storage - per CMS requirements - for all your calls using your unique"
          }
        />
        <b>Integrity Clients Agent Phone Number!</b>
      </div>
      <div className={styles.modalBody}>
        <Heading4
          id="transition-modal-description"
          text={"Your unique Integrity Clients Agent Phone Number is"}
          className={styles.marginY8}
        />
        <Heading2
          id="transition-modal-description"
          text={formatTwiloNumber(agentVirtualPhoneNumber)}
          className={styles.agentVirtualNumber}
        />
        <Paragraph
          id="transition-modal-description"
          text={
            "All calls made TO and FROM your unique Integrity Clients Agent Phone Number are:"
          }
          className={styles.marginY8}
        >
          <ul>
            <li>Recorded</li>
            <li>Accessible only to you</li>
            <li>Attached to your Contacts in Contact Management</li>
            <li>Stored by Integrity Clients for 10 years per CMS regulation</li>
            <li>Downloadable to your personal device</li>
          </ul>
        </Paragraph>
        <Divider sx={{ width: "50%", my: "1rem" }} />

        <Paragraph
          id="transition-modal-description"
          text={"Learn how to use your Integrity Clients Agent Phone Number."}
          className={styles.marginY8}
        />
        <Hyperlink text={"Learn more"} onClick={navigateToLearningPage} />
        <Divider sx={{ width: "50%", my: "1rem" }} />

        <Paragraph
          id="transition-modal-description"
          text={
            "Find your Integrity Clients Agent Phone Number at any time in your Integrity Clients Account"
          }
          className={styles.marginY8}
        />
        <Hyperlink text={"View Account"} onClick={navigateToAccountPage} />
        <Divider sx={{ my: "1rem" }} />

        <Paragraph
          id="transition-modal-description"
          text={"Questions?"}
          className={styles.marginY8}
        />
        <Hyperlink text={"Contact Support"} onClick={navigateToHelpPage} />
        <Divider sx={{ my: "1rem" }} />

        <div className={styles.footerButton}>
          <Button onClick={handleConfirm} size="medium">
            Get Started
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <Modal
      content={modalContent}
      open={open}
      handleClose={close}
      style={{ width: "552px" }}
    />
  );
}
