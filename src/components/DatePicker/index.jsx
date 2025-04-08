import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isValid } from 'date-fns';
import Box from '@mui/material/Box';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarIcon from 'components/icons/version-2/Calendar';
import ArrowDownIcon from 'components/icons/version-2/ArrowDownBig';

function DatePickerMUI({
  disableFuture,
  value,
  onChange,
  className,
  minDate,
  startAdornment = <CalendarIcon />,
  endAdornment = <ArrowDownIcon />,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (!disabled) {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);

  const handleDateChange = newValue => {
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

  const restrictNonNumericKeys = event => {
    if (event.key.length !== 1 || /[^0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        open={open}
        disabled={disabled}
        onOpen={handleOpen}
        onClose={handleClose}
        views={['year', 'month', 'day']}
        disableFuture={disableFuture}
        minDate={minDate}
        value={value ? new Date(value) : null}
        onChange={handleDateChange}
        format='MM/dd/yyyy'
        className={className}
        slotProps={{
          textField: {
            onKeyDown: restrictNonNumericKeys,
            InputProps: {
              endAdornment: (
                <Box mx={1} onClick={handleOpen}>
                  {endAdornment}
                </Box>
              ),
              startAdornment: (
                <Box mx={1} onClick={handleOpen}>
                  {startAdornment}
                </Box>
              ),
              sx: {
                lineHeight: '1 !important',
                '.MuiInputBase-input': {
                  paddingLeft: '0 !important',
                },
                padding: 0,
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
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
};

export default DatePickerMUI;
