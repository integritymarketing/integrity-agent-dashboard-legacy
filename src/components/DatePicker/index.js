import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { isValid } from "date-fns";

export default function DatePickerMUI({
  disableFuture,
  value,
  onChange,
  className,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        views={["year", "month", "day"]}
        disableFuture={disableFuture}
        value={
          isValid(value) && typeof value === "string" ? new Date(value) : null
        }
        onChange={(newValue) => {
          if (!newValue || isNaN(newValue.getTime()) || !isValid(newValue)) {
            // If new value is null or not a date, clear the value
            onChange(null);
          } else {
            // Only call onChange if newValue is a valid date
            onChange(newValue);
          }
        }}
        format={"MM/dd/yyyy"}
        className={className}
      />
    </LocalizationProvider>
  );
}
