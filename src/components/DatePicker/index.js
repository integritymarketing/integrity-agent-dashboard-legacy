import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { isValid } from "date-fns";

import Box from "@mui/material/Box";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";

import Calendar from "components/icons/version-2/Calendar";
import ArrowDownBlue from "components/icons/version-2/ArrowDownBig";

function DatePickerMUI({ disableFuture, value, onChange, className, minDate }) {
    const [lastValidDate, setLastValidDate] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDateChange = (newValue) => {
        if (!newValue || isNaN(newValue.getTime()) || !isValid(newValue)) {
            onChange(null);
        } else {
            onChange(newValue);
        }
    };

    const getDateValue = () => (value ? new Date(value) : lastValidDate ? new Date(lastValidDate) : null);

    useEffect(() => {
        if (value && isValid(new Date(value))) {
            setLastValidDate(value);
        }
    }, [value]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                open={open}
                onOpen={handleOpen}
                onClose={handleClose}
                views={["year", "month", "day"]}
                disableFuture={disableFuture}
                minDate={minDate}
                value={getDateValue()}
                onChange={handleDateChange}
                format="MM/dd/yyyy"
                className={className}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                        }}
                    />
                )}
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
                                    <Calendar />
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

DatePickerMUI.propTypes = {
    disableFuture: PropTypes.bool,
    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
    className: PropTypes.string,
    minDate: PropTypes.instanceOf(Date),
};

export default DatePickerMUI;
