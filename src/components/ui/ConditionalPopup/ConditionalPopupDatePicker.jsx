import PropTypes from 'prop-types';
import ConditionalPopupLayout from './ConditionalPopupLayout';
import DatePickerMUI from 'components/DatePicker';
import styles from './styles.module.scss';
import { Typography } from '@mui/material';

function ConditionalPopupDatePicker({
  header,
  title,
  contentHeading,
  handleApplyClick,
  handleCancelClick,
  applyButtonDisabled,
  values,
  onChange,
  open,
  onClose,
  applyButtonText = 'Next',
  error,
  showAddIcon = false,
  showDeleteSection = false,
  handleRemoveClick,
  minDate,
}) {
  return (
    <ConditionalPopupLayout
      header={header}
      title={title}
      contentHeading={contentHeading}
      handleApplyClick={handleApplyClick}
      handleCancelClick={handleCancelClick}
      applyButtonDisabled={applyButtonDisabled}
      applyButtonText={applyButtonText}
      open={open}
      onClose={onClose}
      showAddIcon={showAddIcon}
      showDeleteSection={showDeleteSection}
      handleRemoveClick={handleRemoveClick}
    >
      <DatePickerMUI
        value={values}
        disableFuture={true}
        onChange={value => onChange(value)}
        className={styles.datepicker}
        iconPosition='left'
        minDate={minDate}
        valueFormat={"yyyy-MM-DD"}
      />
      {error && (
        <Typography variant='body2' color='error' mt={0.5}>
          {error}
        </Typography>
      )}
    </ConditionalPopupLayout>
  );
}

ConditionalPopupDatePicker.propTypes = {
  header: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  contentHeading: PropTypes.string.isRequired,
  handleApplyClick: PropTypes.func.isRequired,
  handleCancelClick: PropTypes.func.isRequired,
  applyButtonDisabled: PropTypes.bool,
  values: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  applyButtonText: PropTypes.string,
  error: PropTypes.string,
  showAddIcon: PropTypes.bool,
  showDeleteSection: PropTypes.bool,
  handleRemoveClick: PropTypes.func,
  minDate: PropTypes.string,
};
export default ConditionalPopupDatePicker;
