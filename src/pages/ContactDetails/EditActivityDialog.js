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
  const {
    activitySubject,
    activityNote,
    activityId,
    createDate,
    modifyDate,
    activityTypeName,
  } = activity;
  const [note, setNote] = useState(activityNote);

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
        <CreatedDate
          value={
            activityTypeName === "Note" && modifyDate ? modifyDate : createDate
          }
        />
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
        disabled={activityNote === note || !note || note?.length < 2}
      >
        {renderContent()}
      </Dialog>
    </Box>
  );
}
