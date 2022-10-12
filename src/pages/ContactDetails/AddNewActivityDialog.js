import Dialog from "packages/Dialog";
import React, { useState } from "react";
import styles from "./AddNewActivityDialog.module.scss";
import { Box, TextField } from "@mui/material";
import ActivitySubjectWithIcon from "./ActivitySubjectWithIcon";

export default function AddNewActivityDialog({
  open,
  onClose,
  onSave,
  leadFullName,
}) {
  const [note, setNote] = useState("");

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
      </div>
    );
  };

  return (
    <Box>
      <Dialog
        keepMounted
        open={open}
        fullWidth={true}
        onSave={() => {
          onSave("Custom Activity", note);
        }}
        title={leadFullName}
        saveText={"Save"}
        onCancel={onClose}
        onClose={onClose}
        maxWidth="sm"
        disabled={note?.length < 2}
      >
        {renderContent()}
      </Dialog>
    </Box>
  );
}
