import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useLeadDetails } from "providers/ContactDetails";
import ContactSectionCard from "packages/ContactSectionCard";
import { Button } from "components/ui/Button";
import EditIcon from "components/icons/icon-edit";
import { TextField } from "@mui/material";

import styles from "./ClientNotes.module.scss";

export const ClientNotes = () => {

    const { leadDetails, updateClientNotes } = useLeadDetails();
    const [notes, setNotes] = useState("");
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        setNotes(leadDetails?.notes || "");
    }, [leadDetails]);

    const saveNotes = () => {
        const payload = {
            ...leadDetails,
            notes: notes,
            primaryContact: "phone",
        }

        updateClientNotes(leadDetails, payload);
        setIsEdit(false);
    }

    return (
        <>
            <ContactSectionCard
                title="Client Notes"
                className={styles.clientNotesContainer}
                isDashboard
                contentClassName={styles.clientNotesContainer_content}

            >
                <Box className={styles.noteInputContainer}>

                    <Box width="80%">
                        <TextField
                            id="outlined-basic"
                            placeholder="Add a note"
                            variant="outlined"
                            value={notes}
                            fullWidth
                            onChange={(e) => setNotes(e.target.value || "")}
                            multiline
                            rows={3}
                            className={styles.notes}
                            disabled={!isEdit}
                        />
                    </Box>
                    <Box width="20%" className={styles.buttonContainer}>
                        {!isEdit ? (
                            <Button
                                icon={<EditIcon color="#ffffff" />}
                                label={"Edit"}
                                className={styles.editButton}
                                onClick={() => setIsEdit(true)}
                                type="tertiary"
                                iconPosition="right"
                            />) : (
                            <>

                                <Button
                                    label={"Cancel"}
                                    className={styles.deleteButton}
                                    type="tertiary"
                                    onClick={() => setIsEdit(false)}
                                />
                                <Button
                                    label={"Save"}
                                    className={styles.editButton}
                                    onClick={saveNotes}
                                    type="tertiary"
                                    disabled={!notes}
                                />

                            </>
                        )}




                    </Box>

                </Box>
            </ContactSectionCard>

        </>
    );
};



