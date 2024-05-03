import { useState } from "react";

import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";

import Clock from "components/icons/version-2/Clock";
import ArrowDownBlue from "components/icons/version-2/ArrowDownBig";

function TimePickerMUI({ value, onChange }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        const reminderDateTime = new Date();

        if (!value) {
            reminderDateTime.setHours(12);
            reminderDateTime.setMinutes(0);
            onChange(reminderDateTime);
        }
    };
    const handleClose = () => setOpen(false);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopTimePicker
                open={open}
                onOpen={handleOpen}
                onClose={handleClose}
                value={value}
                onChange={(newValue) => onChange(newValue)}
                slotProps={{
                    textField: {
                        InputProps: {
                            endAdornment: (
                                <Box onClick={handleOpen}>
                                    <ArrowDownBlue />
                                </Box>
                            ),
                            startAdornment: (
                                <Box onClick={handleOpen}>
                                    <Clock />
                                </Box>
                            ),
                            sx: {
                                padding: "0 5px 0 0",
                                lineHeight: "1 !important",
                                ".MuiInputBase-input": {
                                    paddingLeft: "0 !important",
                                },
                            },
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
}

TimePickerMUI.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
};

export default TimePickerMUI;
