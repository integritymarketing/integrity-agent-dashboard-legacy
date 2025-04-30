import {useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {isValid} from 'date-fns';
import Box from '@mui/material/Box';
import {DesktopDatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import CalendarIcon from 'components/icons/version-2/Calendar';
import ArrowDownIcon from 'components/icons/version-2/ArrowDownBig';
import moment from 'moment';

function DatePickerMUI({
                         disableFuture,
                         value,
                         onChange,
                         className,
                         minDate,
                         startAdornment = <CalendarIcon />,
                         endAdornment = <ArrowDownIcon />,
                         disabled = false,
                         valueFormat = null,
                       }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (!disabled) {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);

  const handleDateChange = (newValue) => {
    if (!newValue || isNaN(newValue.getTime()) || !isValid(newValue)) {
      onChange(null);
    } else {
      if (valueFormat) {
        const dateValue = moment(newValue).format(valueFormat);
        onChange(dateValue);
      } else {
        onChange(newValue);
      }
    }
  };

  const parsedValue = useMemo(() => {
    if (!value) return null;
    return valueFormat ? moment(value, valueFormat).toDate() : new Date(value);
  }, [value, valueFormat]);

  const restrictNonNumericKeys = (event) => {
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
        value={parsedValue}
        onChange={handleDateChange}
        format="MM/dd/yyyy"
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
  value: PropTypes.string,
  /** Callback function to handle date change */
  onChange: PropTypes.func.isRequired,
  /** Additional class name for styling */
  className: PropTypes.string,
  /** Minimum date that can be selected */
  minDate: PropTypes.instanceOf(Date),
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
  /** Disable the date picker */
  disabled: PropTypes.bool,
  /** Format for the value */
  valueFormat: PropTypes.string,
};

export default DatePickerMUI;
