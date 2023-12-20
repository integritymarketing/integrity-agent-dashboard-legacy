import React from "react";
import Modal from "packages/Modal";
import Heading3 from "packages/Heading3";
import styles from "./styles.module.scss";
import { Typography } from "@mui/material";

export const NonRTSModal = ({ modalOpen, handleClose }) => {
  const modalContent = () => {
    return (
      <>
        <Heading3 text="Access Pending" />

        <div className={styles.lowerSectionModal}>
          <Typography
            id="transition-modal-description"
            sx={{ p: "16px" }}
            color={"#434A51"}
          >
            Access to Integrity Clients is not available until we receive your
            carrier appointment information. Please contact your marketer with
            any questions.
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
