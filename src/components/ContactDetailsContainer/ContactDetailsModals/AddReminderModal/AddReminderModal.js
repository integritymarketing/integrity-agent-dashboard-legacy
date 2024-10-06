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

import { ArrowForwardWithCircle } from "components/ContactDetailsContainer/OverviewContainer/Icons";

import styles from "./AddReminderModal.module.scss";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import TextFormatter from "components/Shoppers/ShoppersTextFormat";

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

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down("sm"));

    const reminderTitle = selectedReminder ? "Edit Reminder" : "Add a Reminder";
    const reminderActionButton = selectedReminder ? "Save Reminder" : "Add Reminder";
    const name = `${leadData?.firstName ?? ""} ${leadData?.middleName ?? ""} ${leadData?.lastName ?? ""}`;
    const actionButtonDisabled = !values.date || !values.notes;
    const isShopperActivity = selectedReminder ? selectedReminder?.reminderSource === "Ask Integrity" : false;

    const handleSaveReminder = useCallback(() => {
        const reminderDateTime = new Date(values.date);

        if (values?.time) {
            reminderDateTime.setHours(values?.time?.getHours());
            reminderDateTime.setMinutes(values?.time?.getMinutes());
        } else {
            reminderDateTime.setHours(0);
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
    }, [leadData?.leadsId, navigate]);

    useEffect(() => {
        if (selectedReminder) {
            const { date, fullDate } = getLocalDateTime(selectedReminder.reminderDate);
            const timeValue = new Date(fullDate);
            setValues({
                date: date,
                time: getLocalDateTime(timeValue)?.time !== "12:00 am" ? timeValue : null,
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
            endIcon={<ArrowForwardWithCircle color="white" />}
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
                            <TimePickerMUI
                                value={values.time}
                                date={values.date}
                                onChange={(time) => handleChange("time", time)}
                            />
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
                            inputProps={{ maxLength: 256 }}
                            className={styles.notes}
                            disabled={isShopperActivity}
                        />
                        <Box className={styles.characterCountContainer}>
                            {!isMobileView && values.title.length >= 256 && (
                                <Typography variant="body2" color="error" className={styles.errorText}>
                                    Maximum character length has been reached
                                </Typography>
                            )}

                            <Typography
                                variant="body2"
                                color={values.title.length >= 256}
                                className={styles.characterCount}
                            >
                                {256 - values.title.length} characters remaining
                            </Typography>

                            {isMobileView && values.title.length >= 256 && (
                                <Typography
                                    variant="body2"
                                    color="error"
                                    className={styles.errorText}
                                    sx={{ marginTop: "2px" }}
                                >
                                    Maximum character length has been reached
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <Box className={styles.reminderField}>
                        <h4 className={styles.label}>Notes*</h4>
                        {!isShopperActivity ? (
                            <TextField
                                id="outlined-basic"
                                placeholder="Notes..."
                                variant="outlined"
                                value={values.notes}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                fullWidth
                                inputProps={{ maxLength: 256 }}
                                multiline
                                rows={3}
                                className={styles.notes}
                            />
                        ) : (
                            <Box className={styles.reminderDescriptionAI}>
                                <TextFormatter inputText={values.notes} fontSize="16px" color="rgba(0, 0, 0, 0.38);" />
                            </Box>
                        )}
                        <Box className={styles.characterCountContainer}>
                            {!isMobileView && values.notes.length >= 256 && (
                                <Typography variant="body2" color="error" className={styles.errorText}>
                                    Maximum character length has been reached
                                </Typography>
                            )}

                            <Typography
                                variant="body2"
                                color={values.notes.length >= 256}
                                className={styles.characterCount}
                            >
                                {256 - values.notes.length} characters remaining
                            </Typography>

                            {isMobileView && values.notes.length >= 256 && (
                                <Typography
                                    variant="body2"
                                    color="error"
                                    className={styles.errorText}
                                    sx={{ marginTop: "2px" }}
                                >
                                    Maximum character length has been reached
                                </Typography>
                            )}
                        </Box>
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
