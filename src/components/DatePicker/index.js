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
  minDate,
}) {
  const [lastValidDate, setLastValidDate] = React.useState(null);

  React.useEffect(() => {
    if (value && isValid(new Date(value))) {
      setLastValidDate(value);
    }
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        views={["year", "month", "day"]}
        disableFuture={disableFuture}
        minDate={minDate}
        value={
          value
            ? new Date(value)
            : lastValidDate
            ? new Date(lastValidDate)
            : null
        }
        onChange={(newValue) => {
          if (!newValue || isNaN(newValue.getTime()) || !isValid(newValue)) {
            // If new value is null or not a date, keep the last valid date
            onChange(null); // pass null to your onChange function
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
