import { useMemo } from 'react';
import PropTypes from 'prop-types';
import ConditionalPopupLayout from './ConditionalPopupLayout';
import styles from './styles.module.scss';
import { Typography } from '@mui/material';

const OPTIONS = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

function ConditionalPopupYesOrNo({
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
}) {
  const options = useMemo(
    () =>
      OPTIONS.map(option => (
        <div
          key={option.label}
          className={`${styles.optionValueBox} ${
            option.value === values ? styles.selected : ''
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </div>
      )),
    [values]
  );

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
      showAddIcon={showAddIcon}
      showDeleteSection={showDeleteSection}
      handleRemoveClick={handleRemoveClick}
    >
      <div className={styles.optionValueWrapper}>{options}</div>
      {error && (
        <Typography variant='body2' color='error' mt={0.5}>
          {error}
        </Typography>
      )}
    </ConditionalPopupLayout>
  );
}

ConditionalPopupYesOrNo.propTypes = {
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
};
export default ConditionalPopupYesOrNo;
