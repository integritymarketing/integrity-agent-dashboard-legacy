import Dialog from "packages/Dialog";
import React, {useState} from "react";
import styles from "./AddNewActivityDialog.module.scss";
import { Box, TextField } from "@mui/material";

export default function AddNewActivityDialog({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const renderContent = () => {
    return (
      <div>
        <div>
          <div className={styles.subHeading}>Activity Title</div>
          <div>
            <TextField
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
        keepMounted
        open={open}
        fullWidth={true}
        onSave={() => {
          onSave(title, note);
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
