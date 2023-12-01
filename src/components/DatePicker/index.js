import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from '@mui/material/TextField';
import { isValid } from "date-fns";
import EventIcon from '@mui/icons-material/Event'; // Importing a calendar icon

export default function DatePickerMUI({
  disableFuture,
  value,
  onChange,
  className,
  minDate,
}) {
  const [lastValidDate, setLastValidDate] = React.useState(null);

  React.useEffect(() => {
    if (value && isValid(new Date(value))) {
      setLastValidDate(value);
    } else {
      setLastValidDate("");
    }
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        views={["year", "month", "day"]}
        sx={{ width: "100%" }}
        disableFuture={disableFuture}
        minDate={minDate}
        inp
        value={
          value
            ? new Date(value)
            : lastValidDate
              ? new Date(lastValidDate)
              : null
        }
        onChange={(newValue) => {
          if (!newValue || isNaN(newValue.getTime()) || !isValid(newValue)) {
            onChange(null);
          } else {
            onChange(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              style: {
                padding: "8.5px 14px",
              },
            }}
          />
        )}
        className={className}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <EventIcon /> // Icon positioned on the left side
              ),
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
}
