import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

export default function TimePickerMUI({ label, value, onChange }) {

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopTimePicker value={value}
                onChange={(newValue) => onChange(newValue)} />

        </LocalizationProvider>
    );
}