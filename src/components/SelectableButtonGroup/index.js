import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss'

/**
 * Component representing a label with two selectable buttons.
 * @param {Object} props - Component props.
 * @param {string} props.labelText - Text for the label.
 * @param {string} props.labelClassName - Custom class name for the label.
 * @param {string} props.selectedButtonText - The text of the selected button.
 * @param {string} props.firstButtonText - Text for the first button.
 * @param {string} props.secondButtonText - Text for the second button.
 * @param {string} props.firstButtonClassName - Custom class name for the first button.
 * @param {string} props.secondButtonClassName - Custom class name for the second button.
 * @param {Function} props.onSelect - Callback function when a button is selected.
 * @returns {JSX.Element} - Rendered component.
 */

const SelectableButtonGroup = ({
  labelText,
  labelClassName,
  selectedButtonText,
  firstButtonText,
  secondButtonText,
  firstButtonClassName,
  secondButtonClassName,
  onSelect
}) => {

    const getButtonStyle = (buttonText, customClassName) => {
    const baseStyle = selectedButtonText === buttonText
        ? `${styles.expandableButton} ${styles.selected}`
        : styles.expandableButton;
    return `${baseStyle} ${customClassName}`;
  };

  return (
    <div>
      <label className={styles.labelClassName}>{labelText}</label>
      <div className={styles.buttonContainer}>
        <button
          className={getButtonStyle(firstButtonText, firstButtonClassName)}
          onClick={() => onSelect(firstButtonText)}
        >
          {firstButtonText}
        </button>
        <button
          className={getButtonStyle(secondButtonText, secondButtonClassName)}
          onClick={() => onSelect(secondButtonText)}
        >
          {secondButtonText}
        </button>
      </div>
    </div>
  );
};

SelectableButtonGroup.propTypes = {
  labelText: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  selectedButtonText: PropTypes.string,
  firstButtonText: PropTypes.string.isRequired,
  secondButtonText: PropTypes.string.isRequired,
  firstButtonClassName: PropTypes.string,
  secondButtonClassName: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

SelectableButtonGroup.defaultProps = {
  labelClassName: '',
  firstButtonClassName: '',
  secondButtonClassName: '',
};

export default SelectableButtonGroup;
