import Dialog from "packages/Dialog";
import React, { useState } from "react";
import styles from "./AddNewActivityDialog.module.scss";
import { Box, TextField } from "@mui/material";
import ActivitySubjectWithIcon from "./ActivitySubjectWithIcon";
import CreatedDate from "./CreatedDate";

export default function EditActivityDialog({
  open,
  onClose,
  onSave,
  activity,
  leadFullName,
}) {
  const { activitySubject, activityBody, activityId, modifyDate } =
    activity;
  const [note, setNote] = useState(activityBody);

  const renderContent = () => {
    return (
      <div>
        <div className={styles.subHeading}>
          <div className={styles.subHeadingTitle}>
            <ActivitySubjectWithIcon />
            Custom Activity
          </div>
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
            rows={2}
            placeholder="Add a note about this activity"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
        </div>
        <CreatedDate value={modifyDate} />
      </div>
    );
  };

  return (
    <Box>
      <Dialog
        open={open}
        fullWidth={true}
        onSave={() => {
          onSave(activityId, activitySubject, note);
        }}
        title={leadFullName}
        saveText={"Save"}
        onCancel={onClose}
        onClose={onClose}
        maxWidth="sm"
        disabled={activityBody === note || !note || note?.length < 2}
      >
        {renderContent()}
      </Dialog>
    </Box>
  );
}
