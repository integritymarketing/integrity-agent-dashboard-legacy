import React, { useState, useMemo, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Modal from "components/Modal";
import { Add } from "../Icons";
import DatePickerMUI from "components/DatePicker";
import TimePickerMUI from "components/TimePicker/TimePicker";
import styles from "./AddReminderModal.module.scss";
import TextField from "@mui/material/TextField";
import { getDateTime, getLocalDateTime, isTimeValid } from "utils/dates";



export const AddReminderModal = ({ open, onClose, onSave, selectedReminder }) => {
    const initialReminderValues = {
        date: null,
        time: null,
        notes: "",
    };

    const [values, setValues] = useState(initialReminderValues);

    useEffect(() => {
        if (selectedReminder) {
            const { date, fullDate } = getLocalDateTime(selectedReminder.reminderDate);
            const timeValue = new Date(fullDate);

            setValues({
                date: date,
                time: timeValue,
                notes: selectedReminder.reminderNote,
            })
        }
    }, [selectedReminder]);

    const actionButtonDisabled = useMemo(() => {
        return !values.date || !isTimeValid(values.time) || !values.notes;
    }, [values.date, values.time, values.notes]);

    const handleSaveReminder = useCallback(() => {
        const reminderDateTime = new Date(values.date);
        reminderDateTime.setHours(values.time.getHours());
        reminderDateTime.setMinutes(values.time.getMinutes());

        const payload = {
            ...selectedReminder,
            reminderNote: values.notes,
            reminderDate: reminderDateTime
        };

        onSave(payload);
    }, [values, onSave, selectedReminder]);

    const handleChange = useCallback((field, value) => {
        setValues(prevValues => ({ ...prevValues, [field]: value }));
    }, []);

    const reminderTitle = selectedReminder ? "Save Reminder" : "Add a Reminder";
    const reminderActionButton = selectedReminder ? "Save Reminder" : "Add Reminder";


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
                endIcon={<Add color="white" />}
            >
                <Box className={styles.connectModalBody}>
                    <Box className={styles.dateTimePickers} >
                        <Box width={"45%"} >
                            <h4 className={styles.label}>On a Day</h4>
                            <DatePickerMUI
                                value={values.date}
                                onChange={(date) => handleChange('date', date)}
                            />
                        </Box>
                        <Box width={"45%"}>
                            <h4 className={styles.label}>At a Time</h4>
                            <TimePickerMUI
                                value={values.time}
                                onChange={(time) => handleChange('time', time)}
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
                            onChange={(e) => handleChange('notes', e.target.value)}
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
