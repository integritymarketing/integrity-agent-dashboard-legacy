import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "components/Modal";
import { Add } from "../Icons";
import DatePickerMUI from "components/DatePicker";
import TimePickerMUI from "components/TimePicker/TimePicker";
import styles from "./AddReminderModal.module.scss";
import TextField from "@mui/material/TextField";
import { getDateTime } from "utils/dates";

export const AddReminderModal = ({ open, onClose, onSave, selectedReminder, }) => {
    const [values, setValues] = useState({
        date: "",
        time: null,
        notes: "",
    });

    useEffect(() => {
        if (selectedReminder) {
            setValues({
                date: getDateTime(selectedReminder.reminderDate).date,
                time: getDateTime(selectedReminder.reminderDate).time,
                notes: selectedReminder.reminderNote,
            })
        }
    }, [selectedReminder]);

    const actionButtonDisabled = useMemo(() => {
        return !values.date || !values.time || !values.notes;
    }, [values.date, values.time, values.notes]);

    const handleSaveReminder = () => {
        const fullDate = new Date(values.date);
        fullDate.setHours(values.time.getHours());
        fullDate.setSeconds(values.time.getSeconds());

        const payload = {
            reminderNote: values.notes,
            reminderDate: fullDate.toISOString(),
        };
        onSave(payload);
    }

    const reminderTitle = selectedReminder ? "Edit Reminder" : "Add a Reminder";
    const reminderActionButton = selectedReminder ? "Edit Reminder" : "Add Reminder";

    return (
        <>
            <Modal
                maxWidth="sm"
                open={open}
                onClose={onClose}
                onCancel={onClose}
                title={reminderTitle}
                onSave={handleSaveReminder}
                actionButtonName={reminderActionButton}
                actionButtonDisabled={actionButtonDisabled}
                endIcon={<Add />}
            >
                <Box className={styles.connectModalBody}>
                    <Box className={styles.dateTimePickers} >
                        <Box width={"45%"} >
                            <h4 className={styles.label}>On a Day</h4>
                            <DatePickerMUI
                                value={values.date}
                                onChange={(date) => setValues({ ...values, date: date })}

                            />
                        </Box>
                        <Box width={"45%"}>
                            <h4 className={styles.label}>At a Time</h4>
                            <TimePickerMUI
                                value={values.time}
                                label="12:00 PM"
                                onChange={(time) => setValues({ ...values, time: time })}

                            />
                        </Box>
                    </Box>
                    <Box className={styles.reminderNotes} >
                        <h4 className={styles.label}>Notes</h4>
                        <TextField
                            id="outlined-basic"
                            placeholder="Add a note"
                            variant="outlined"
                            value={values.notes}
                            onChange={(e) => setValues({ ...values, notes: e.target.value })}
                            fullWidth
                            multiline
                            rows={4}
                            className={styles.notes}
                        />
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

