import { Typography, Box, Checkbox } from '@mui/material';
import PropTypes from 'prop-types';
import ConditionalPopupLayout from './ConditionalPopupLayout';
import { useCallback } from 'react';

function ConditionalPopupMultiSelect({
  header,
  title,
  contentHeading,
  handleApplyClick,
  handleCancelClick,
  applyButtonDisabled,
  values,
  open,
  onClose,
  applyButtonText = 'Next',
  error,
  options,
  setValues,
}) {
  const handleMultiSelection = useCallback(
    selectedOption => {
      setValues(prev =>
        prev === null
          ? [selectedOption]
          : prev.includes(selectedOption)
          ? prev.filter(opt => opt !== selectedOption)
          : [...prev, selectedOption]
      );
    },
    [setValues]
  );

  const handleBoxClick = optionValue => {
    handleMultiSelection(optionValue);
  };

  const handleCheckboxClick = (e, optionValue) => {
    e.stopPropagation();
    handleMultiSelection(optionValue);
  };

  return (
    <ConditionalPopupLayout
      header={header}
      title={title}
      contentHeading={contentHeading}
      handleApplyClick={handleApplyClick}
      handleCancelClick={handleCancelClick}
      applyButtonDisabled={applyButtonDisabled}
      open={open}
      onClose={onClose}
      applyButtonText={applyButtonText}
    >
      {options.map(option => (
        <Box
          key={option.id}
          border={1}
          m={0.5}
          p={2}
          display='flex'
          alignItems='center'
          bgcolor={values?.includes(option.value) ? '#F1FAFF' : ''}
          borderRadius={2}
          onClick={() => handleBoxClick(option.value)}
          sx={{ cursor: 'pointer' }}
        >
          <Checkbox
            checked={values?.includes(option.value)}
            onClick={e => handleCheckboxClick(e, option.value)}
          />
          {option.displayText}
        </Box>
      ))}

      {error && (
        <Typography variant='body2' color='error' mt={0.5}>
          {error}
        </Typography>
      )}
    </ConditionalPopupLayout>
  );
}

ConditionalPopupMultiSelect.propTypes = {
  header: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  contentHeading: PropTypes.string.isRequired,
  handleApplyClick: PropTypes.func.isRequired,
  handleCancelClick: PropTypes.func.isRequired,
  applyButtonDisabled: PropTypes.bool,
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  applyButtonText: PropTypes.string,
  error: PropTypes.string,
  options: PropTypes.array.isRequired,
  setValues: PropTypes.func.isRequired,
};

export default ConditionalPopupMultiSelect;
