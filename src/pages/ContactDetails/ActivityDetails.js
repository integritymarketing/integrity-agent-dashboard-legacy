import React, { useState } from "react";
import styles from "./ActivityDetails.module.scss";
import { Box, TextField } from "@mui/material";
import Dialog from "packages/Dialog";
import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import ActivityButtonText from "pages/ContactDetails/ActivityButtonText.js";
import CreatedDate from "./CreatedDate";

export default function ActivityDetails({
  open,
  onSave,
  onClose,
  activityObj,
  leadFullName,
}) {
  const [note, setNote] = useState(activityObj.activityBody);

  let type = activityObj?.activityTypeName;
  return (
    <Box>
      <Dialog
        fullWidth={true}
        keepMounted
        open={open}
        onSave={() => {
          onSave(activityObj, note);
        }}
        title={leadFullName}
        saveText={"Save"}
        onCancel={onClose}
        onClose={onClose}
        maxWidth="sm"
        disabled={!note || note?.length < 2}
      >
        <div className={styles.subSection}>
          {activityObj && type === "Triggered" && (
            <div>
              <div className={styles.subHeading}>
                <div className={styles.subHeadingTitle}>
                  <ActivitySubjectWithIcon
                    activitySubject={activityObj?.activitySubject}
                  />
                  {activityObj?.activitySubject}
                </div>
              </div>
              <div className={styles.topSection}>
                {activityObj?.activityBody}
                <ActivityButtonText activity={activityObj} />
              </div>
              <CreatedDate value={activityObj?.createdDate} />
            </div>
          )}
          {type === "Note" && (
            <div className={styles.subHeading}>
              <div className={styles.subHeadingTitle}>
                <ActivitySubjectWithIcon
                  activitySubject={activityObj?.activitySubject}
                />
                Custom Activity
              </div>
            </div>
          )}
          <div>
            {type === "Triggered" && (
              <div className={styles.subHeading}>
                <div className={styles.subHeadingTitle}>Activity Note</div>
              </div>
            )}
            <div>
              <TextField
                sx={{
                  background: "white",
                  border: "1px solid #DFDEDD",
                  borderRadius: "8px",
                  placeholder: {
                    color: "red",
                  },
                }}
                hiddenLabel
                multiline
                fullWidth
                rows={2}
                value={note || ""}
                placeholder="Add a note about this activity"
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </div>
            {type === "Note" && (
              <CreatedDate value={activityObj?.createdDate} />
            )}
          </div>
        </div>
      </Dialog>
    </Box>
  );
}
