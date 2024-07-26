import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isValid } from "date-fns";
import Box from "@mui/material/Box";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import CalendarIcon from "components/icons/version-2/Calendar";
import ArrowDownIcon from "components/icons/version-2/ArrowDownBig";
 
function DatePickerMUI({ disableFuture, value, onChange, className, minDate }) {
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
 
    useEffect(() => {
        if (value && isValid(new Date(value))) {
            onChange(value);
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
                value={value ? new Date(value) : null}
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
                                    <ArrowDownIcon />
                                </Box>
                            ),
                            startAdornment: (
                                <Box onClick={handleOpen}>
                                    <CalendarIcon />
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
    /** Disable selecting future dates */
    disableFuture: PropTypes.bool,
    /** The selected date value */
    value: PropTypes.instanceOf(Date),
    /** Callback function to handle date change */
    onChange: PropTypes.func.isRequired,
    /** Additional class name for styling */
    className: PropTypes.string,
    /** Minimum date that can be selected */
    minDate: PropTypes.instanceOf(Date),
};
 
export default DatePickerMUI;
 