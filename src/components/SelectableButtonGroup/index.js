import {useMemo} from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

/**
 * Component representing a label with selectable buttons.
 * @param {Object} props - Component props.
 * @param {string} props.labelText - Text for the label.
 * @param {string} props.labelClassName - Custom class name for the label.
 * @param {string} props.selectedButtonText - The text of the selected button.
 * @param {Array} props.buttonOptions - Array of button texts.
 * @param {Array} props.buttonClassNames - Array of class names for buttons.
 * @param {Function} props.onSelect - Callback function when a button is selected.
 * @returns {JSX.Element} - Rendered component.
 */
const SelectableButtonGroup = ({
  labelText,
  labelClassName,
  selectedButtonText,
  buttonOptions,
  buttonClassNames,
  onSelect
}) => {

  const getButtonStyle = useMemo(() => (buttonText, index) => {
    const isSelected = buttonOptions.some(option => option?.toLowerCase() === selectedButtonText.toLowerCase()) && 
                       buttonText.toLowerCase() === selectedButtonText?.toLowerCase();
    const baseStyle = isSelected ? `${styles.expandableButton} ${styles.selected}` : styles.expandableButton;
    const customClassName = buttonClassNames[index] || '';
    return `${baseStyle} ${customClassName}`;
  }, [buttonOptions, selectedButtonText, buttonClassNames]);

  return (
    <div>
      <label className={`${styles.label} ${labelClassName}`}>{labelText}</label>
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

SelectableButtonGroup.defaultProps = {
  labelClassName: '',
  buttonClassNames: [],
};

export default SelectableButtonGroup;
