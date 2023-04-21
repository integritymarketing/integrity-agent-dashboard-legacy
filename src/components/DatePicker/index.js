import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DatePickerMUI({ disableFuture, value, onChange }) {
  console.log("kkkkk", value);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={"Select a Birthdate"}
        views={["year", "month", "day"]}
        disableFuture={disableFuture}
        value={new Date(value)}
        onChange={onChange}
        format={"MM/dd/yyyy"}
      />
    </LocalizationProvider>
  );
}
