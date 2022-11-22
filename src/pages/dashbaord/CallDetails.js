import React from "react";
import styles from "pages/ContactDetails/ActivityDetails.module.scss";
import { Box } from "@mui/material";
import { Button } from "packages/Button";
import Dialog from "packages/Dialog";
import { callDuration } from "utils/dates";
import { formatPhoneNumber } from "utils/phones";
import CreatedDate from "pages/ContactDetails/CreatedDate";

export default function CallDetails({ open, onClose, callObj }) {
  let number = formatPhoneNumber(callObj?.from, true)?.toString();
  let duration = callDuration(
    callObj?.recordingStartTime,
    callObj?.callEndTime
  );

  return (
    <Box>
      <Dialog
        fullWidth={true}
        keepMounted
        open={open}
        title={"Call Recording"}
        onCancel={onClose}
        onClose={onClose}
        maxWidth="sm"
      >
        <div className={styles.subSection}>
          <div>
            <div className={styles.subHeading}>
              <div className={styles.subHeadingTitle}>{number}</div>
            </div>
            <div className={styles.topSection}>
              <div>
                Call recorded to : {formatPhoneNumber(callObj?.to, true)}
              </div>
              <div>Call Duration : {duration}</div>
              <Button
                variant="primary"
                onClick={() => window.open(callObj?.url, "_blank")}
              >
                Download
              </Button>
            </div>
            <CreatedDate value={callObj?.callStartTime} />
          </div>
        </div>
      </Dialog>
    </Box>
  );
}
