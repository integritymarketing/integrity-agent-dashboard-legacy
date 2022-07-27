import React, { useEffect, useState } from "react";
import styles from "./ActivityDetails.module.scss";
import { Box, TextField } from "@mui/material";
import { Button } from "packages/Button";
import Dialog from "packages/Dialog";
import { dateFormatter } from "utils/dateFormatter";
import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";

export default function ActivityDetails({
  open,
  onSave,
  onClose,
  activityObj,
  leadFullName
}) {
  const [scope, setScope] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote(activityObj.activityNote);
  },[activityObj]);

  return (
    <Box>
      <Dialog
        fullWidth={true}
        keepMounted
        open={open}
        onSave={() => {
          onSave(scope, note);
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
                  <ActivitySubjectWithIcon activitySubject={activityObj?.activitySubject}/>
                  {activityObj?.activitySubject}
                </div>
                <div>{dateFormatter(activityObj?.createDate, 'MM/DD/YYYY')}</div>
              </div>
              <div className={styles.topSection}>
                The scope of appointment is {activityObj.scope}.
                <Button
                  variant="primary"
                  text={activityObj.action}
                  size="small"
                  disabled={false}
                  callback={() => {
                    setScope("");
                  }}
                ></Button>
              </div>
            </div>
          )}
          <div>
            <div className={styles.subHeading}>
              <div className={styles.subHeadingTitle}>Activity Note</div>
            </div>
            <div>
              <TextField
                hiddenLabel
                multiline
                fullWidth
                rows={4}
                value={note || ''}
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
