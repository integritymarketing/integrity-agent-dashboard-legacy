import React, { useState } from "react";
import styles from "./ActivityDetails.module.scss";
import { Box, TextField } from "@mui/material";
import Dialog from "packages/Dialog";
import { dateFormatter } from "utils/dateFormatter";
import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import ActivityButtonText from "pages/ContactDetails/ActivityButtonText.js";
import { convertUTCDateToLocalDate } from "utils/dates";

export default function ActivityDetails({
  open,
  onSave,
  onClose,
  activityObj,
  leadFullName,
}) {
  const [note, setNote] = useState(activityObj.activityNote);
  let date = convertUTCDateToLocalDate(activityObj?.createDate);

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
      >
        <div className={styles.subSection}>
          {activityObj && (
            <div>
              <div className={styles.subHeading}>
                <div className={styles.subHeadingTitle}>
                  <ActivitySubjectWithIcon
                    activitySubject={activityObj?.activitySubject}
                  />
                  {activityObj?.activitySubject}
                </div>
                <div>{dateFormatter(date, "MM/DD/YYYY")}</div>
              </div>
              <div className={styles.topSection}>
                {activityObj?.activityBody}
                <ActivityButtonText activity={activityObj} />
              </div>
            </div>
          )}
          <div>
            <div className={styles.subHeading}>
              <div className={styles.subHeadingTitle}>Activity Note</div>
            </div>
            <div>
              <TextField
                sx={{
                  background: "white",
                  border: "1px solid #DFDEDD",
                  borderRadius: "8px",
                }}
                hiddenLabel
                multiline
                fullWidth
                rows={4}
                value={note || ""}
                placeholder="Add a note about this activity"
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </Box>
  );
}
