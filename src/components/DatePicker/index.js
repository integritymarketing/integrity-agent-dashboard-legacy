import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function DatePickerMUI({ disableFuture, value, onChange, className }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        views={["year", "month", "day"]}
        disableFuture={disableFuture}
        value={new Date(value)}
        onChange={onChange}
        format={"MM/dd/yyyy"}
        className={className}
      />
    </LocalizationProvider>
  );
}
