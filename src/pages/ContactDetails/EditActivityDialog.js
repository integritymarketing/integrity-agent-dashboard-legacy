import Dialog from "packages/Dialog";
import React, { useState } from "react";
import styles from "./AddNewActivityDialog.module.scss";
import { Box, TextField } from "@mui/material";

export default function EditActivityDialog({
  open,
  onClose,
  onSave,
  activity,
}) {
  const { activitySubject, activityBody, activityId } = activity;
  const [title, setTitle] = useState(activitySubject);
  const [note, setNote] = useState(activityBody);
  const renderContent = () => {
    return (
      <div>
        <div>
          <div className={styles.subHeading}>Edit Note</div>
          <div>
            <TextField
              sx={{ background: "white", border: "1px solid #DFDEDD", borderRadius: "8px" }}
              hiddenLabel
              fullWidth
              rows={2}
              placeholder="Add a title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
        </div>
        <div>
          <div className={styles.subHeading}>Activity Note</div>
          <div>
            <TextField
              sx={{ background: "white", border: "1px solid #DFDEDD", borderRadius: "8px" }}
              hiddenLabel
              multiline
              fullWidth
              rows={4}
              placeholder="Add a note about this activity"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Box>
      <Dialog
        open={open}
        fullWidth={true}
        onSave={() => {
          onSave(activityId, title, note);
        }}
        title={"New Note"}
        saveText={"Save"}
        onCancel={onClose}
        onClose={onClose}
        maxWidth="sm"
      >
        {renderContent()}
      </Dialog>
    </Box>
  );
}
