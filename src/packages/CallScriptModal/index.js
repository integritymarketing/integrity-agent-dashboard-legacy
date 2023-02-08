import React from "react";
import Modal from "packages/Modal";
import Heading3 from "packages/Heading3";
import styles from "./styles.module.scss";
import { Typography } from "@mui/material";

export const CallScriptModal = ({ modalOpen, handleClose }) => {
  const modalContent = () => {
    return (
      <>
        <Heading3 text="Recorded Call Script" />
        <div className={styles.upperSectionModal}>
          <Typography
            id="transition-modal-subtitle"
            variant="subtitle1"
            color={"#434A51"}
          >
            To be in compliance with CMS guidelines, please read this script
            before every call
          </Typography>
        </div>
        <div className={styles.lowerSectionModal}>
          <Typography
            id="transition-modal-description"
            sx={{ p: "16px" }}
            color={"#434A51"}
          >
            This call may be recorded for quality assurance or training
            purposes. We do not offer every plan available in your area. Any
            information we provide is limited to those plans we do offer in your
            area. Please contact Medicare.gov or 1-800-MEDICARE to get
            information on all of your options.
          </Typography>
        </div>
      </>
    );
  };

  return (
    <Modal
      content={modalContent()}
      open={modalOpen}
      handleClose={() => handleClose()}
    />
  );
};
