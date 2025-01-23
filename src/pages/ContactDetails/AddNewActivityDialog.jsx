import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "components/Modal";
import { Add } from "components/ContactDetailsContainer/ContactDetailsModals/Icons";
import styles from "./AddNewActivityDialog.module.scss";
import TextField from "@mui/material/TextField";
import ActivitySubjectWithIcon from "./ActivitySubjectWithIcon";

export default function AddNewActivityDialog({ open, onClose, onSave, leadFullName, leadId }) {
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

    const handleSave = () => {
        const payload = {
            activitySubject: "Custom Activity",
            activityNote: note,
            leadsId: leadId,
            activityTypeId: 0,
        };
        onSave(payload);
        onClose();
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
                onSave={handleSave}
                actionButtonName="Save"
                actionButtonDisabled={note?.length < 2}
                endIcon={<Add color="white" />}
            >
                <Box className={styles.connectModalBody}>{renderContent()}</Box>
            </Modal>
        </Box>
    );
}
