import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "components/Modal";
import { Add } from "components/ContactDetailsContainer/ContactDetailsModals/Icons";
import styles from "./AddNewActivityDialog.module.scss";
import TextField from "@mui/material/TextField";
import ActivitySubjectWithIcon from "./ActivitySubjectWithIcon";
import CreatedDate from "./CreatedDate";

export default function EditActivityDialog({ open, onClose, onSave, activity, leadFullName, leadId }) {
    const { activitySubject, activityNote, activityId, createDate, modifyDate, activityTypeName } = activity;
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
                            onClose();
                        }}
                    />
                </div>
                <CreatedDate value={activityTypeName === "Note" && modifyDate ? modifyDate : createDate} />
            </div>
        );
    };

    return (
        <Box>
            <Modal
                maxWidth="sm"
                open={open}
                onClose={onClose}
                onCancel={onClose}
                title={
                    <div className={styles.subHeading}>
                        <ActivitySubjectWithIcon activitySubject={leadFullName} />
                        {leadFullName}
                    </div>
                }
                onSave={() => {
                    onSave(activity, note, leadId);
                }}
                actionButtonName="Save"
                actionButtonDisabled={activityNote === note || !note || note?.length < 2}
                endIcon={<Add />}
            >
                {renderContent()}
            </Modal>
        </Box>
    );
}
