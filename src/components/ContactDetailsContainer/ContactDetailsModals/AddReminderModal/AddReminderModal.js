/* eslint-disable max-lines-per-function */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import useDeviceType from "hooks/useDeviceType";

import Modal from "components/Modal";
import DatePickerMUI from "components/DatePicker";
import TimePickerMUI from "components/TimePicker/TimePicker";
import ArrowRight from "components/icons/version-2/ArrowRight";

import { getLocalDateTime } from "utils/dates";

import { Add } from "../Icons";
import { ArrowForwardWithCircle } from "components/ContactDetailsContainer/OverviewContainer/Icons";

import styles from "./AddReminderModal.module.scss";

const initialReminderValues = {
    date: null,
    time: null,
    notes: "",
    title: "",
};

export const AddReminderModal = ({ open, onClose, onSave, selectedReminder, leadData = null, showLink = false }) => {
    const [values, setValues] = useState(initialReminderValues);
    const navigate = useNavigate();
    const { isMobile } = useDeviceType();

    const reminderTitle = selectedReminder ? "Edit Reminder" : "Add a Reminder";
    const reminderActionButton = selectedReminder ? "Save Reminder" : "Add Reminder";
    const name = `${leadData?.firstName ?? ""} ${leadData?.middleName ?? ""} ${leadData?.lastName ?? ""}`;
    const actionButtonDisabled = !values.date || !values.notes;

    const handleSaveReminder = useCallback(() => {
        const reminderDateTime = new Date(values.date);

        if (values?.time) {
            reminderDateTime.setHours(values?.time?.getHours());
            reminderDateTime.setMinutes(values?.time?.getMinutes());
        } else {
            reminderDateTime.setHours(12);
            reminderDateTime.setMinutes(0);
        }

        const payload = {
            ...selectedReminder,
            reminderNote: values.notes,
            reminderDate: reminderDateTime,
            reminderTitle: values.title || "",
        };
        onSave(payload);
    }, [values, onSave, selectedReminder]);

    const handleChange = useCallback((field, value) => {
        setValues((prevValues) => ({ ...prevValues, [field]: value }));
    }, []);

    const onViewContactHandle = useCallback(() => {
        navigate(`/contact/${leadData.leadsId}/overview`);
    }, [leadData.leadsId, navigate]);

    useEffect(() => {
        if (selectedReminder) {
            const { date, fullDate } = getLocalDateTime(selectedReminder.reminderDate);
            const timeValue = new Date(fullDate);
            setValues({
                date: date,
                time: timeValue,
                notes: selectedReminder.reminderNote,
                title: selectedReminder.reminderTitle,
            });
        }
    }, [selectedReminder]);

    return (
        <Modal
            maxWidth="sm"
            open={open}
            onClose={onClose}
            onCancel={onClose}
            title={reminderTitle}
            onSave={handleSaveReminder}
            actionButtonName={reminderActionButton}
            actionButtonDisabled={actionButtonDisabled}
            endIcon={< ArrowForwardWithCircle color="white" />}
        >
            <>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box className={styles.name}>{name}</Box>
                    {showLink && (
                        <Box className={styles.link} onClick={onViewContactHandle}>
                            {!isMobile && <>View Contact</>} <ArrowRight />
                        </Box>
                    )}
                </Box>
                <Box className={styles.connectModalBody}>
                    <Box className={styles.dateTimePickers}>
                        <Box className={styles.dateTimePickersItem}>
                            <h4 className={styles.label}>Due On*</h4>
                            <DatePickerMUI value={values.date} onChange={(date) => handleChange("date", date)} />
                        </Box>
                        <Box className={styles.dateTimePickersItem}>
                            <h4 className={styles.label}>At a Time</h4>
                            <TimePickerMUI value={values.time} onChange={(time) => handleChange("time", time)} />
                        </Box>
                    </Box>
                    <Box className={styles.reminderField}>
                        <h4 className={styles.label}>Reminder Title</h4>
                        <TextField
                            id="outlined-basic"
                            placeholder="Add a Reminder…..."
                            variant="outlined"
                            value={values.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            fullWidth
                            className={styles.notes}
                        />
                    </Box>
                    <Box className={styles.reminderField}>
                        <h4 className={styles.label}>Notes*</h4>
                        <TextField
                            id="outlined-basic"
                            placeholder="Notes..."
                            variant="outlined"
                            value={values.notes}
                            onChange={(e) => handleChange("notes", e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            className={styles.notes}
                        />
                    </Box>
                </Box>
            </>
        </Modal>
    );
};

AddReminderModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    selectedReminder: PropTypes.shape({
        reminderDate: PropTypes.string,
        reminderNote: PropTypes.string,
        reminderTitle: PropTypes.string,
    }),
    leadData: PropTypes.object,
    showLink: PropTypes.bool,
};