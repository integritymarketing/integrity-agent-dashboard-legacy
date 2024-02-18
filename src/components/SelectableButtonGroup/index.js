import { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

/**
 * Component for displaying a label with selectable buttons.
 * Each button can be individually styled and selected. Selection is case-insensitive.
 *
 * @param {Object} props - Component props.
 * @param {string} props.labelText - The text to display for the label.
 * @param {string} [props.labelClassName] - Optional custom class name for the label.
 * @param {string} props.selectedButtonText - The text of the currently selected button.
 * @param {string[]} props.buttonOptions - An array of button texts.
 * @param {string[]} [props.buttonClassNames=[]] - Optional array of class names for button styling.
 * @param {Function} props.onSelect - Callback function when a button is selected.
 */
const SelectableButtonGroup = ({
  labelText,
  labelClassName = '',
  selectedButtonText,
  buttonOptions,
  buttonClassNames = [],
  onSelect,
}) => {
  const getButtonStyle = useMemo(() => {
    return (buttonText, index) => {
      const isSelected = buttonOptions.some(option => option && selectedButtonText && option.toLowerCase() === selectedButtonText.toLowerCase()) &&
                         buttonText && selectedButtonText && buttonText.toLowerCase() === selectedButtonText.toLowerCase();
      const baseStyle = isSelected ? `${styles.expandableButton} ${styles.selected}` : styles.expandableButton;
      const customClassName = buttonClassNames[index] || '';
      return `${baseStyle} ${customClassName}`;
    };
  }, [buttonOptions, selectedButtonText, buttonClassNames]);

  return (
    <div>
      <label className={`${styles.label} ${labelClassName || ''}`.trim()}>{labelText}</label>
      <div className={styles.buttonContainer}>
        {buttonOptions.map((text, index) => (
          <button
            key={index}
            className={getButtonStyle(text, index)}
            onClick={() => onSelect(text)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

SelectableButtonGroup.propTypes = {
  labelText: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  selectedButtonText: PropTypes.string,
  buttonOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonClassNames: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func.isRequired,
};

export default SelectableButtonGroup;
