import React from "react";
import PropTypes from "prop-types";

/**
 * Renders a color option with styling and click handler.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.value - The value of the color option.
 * @param {string} props.label - The label of the color option.
 * @param {string} props.color - The color to display.
 * @param {boolean} [props.selected=false] - If the option is selected.
 * @param {Function} [props.onClick] - The function to call on click.
 * @param {boolean} [props.filter] - If a filter should be applied to the option.
 * @param {string} [props.className] - Additional CSS class to apply to the option.
 */
export const ColorOptionRender = ({ value, label, color, selected = false, onClick, filter, className }) => {
    const handleClick = (event) => {
        if (onClick) {
            onClick(event, value);
        }
    };

    return (
        <div className={`option ${selected ? "selected" : ""} ${filter ? className : ""}`} onClick={handleClick}>
            <span
                style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 5,
                }}
            />
            <span>{label}</span>
        </div>
    );
};

ColorOptionRender.propTypes = {
    value: PropTypes.string.isRequired, // The unique identifier for the color option
    label: PropTypes.string.isRequired, // The display text for the color option
    color: PropTypes.string.isRequired, // The actual color value for the color swatch
    selected: PropTypes.bool, // Indicates if the color option is selected
    onClick: PropTypes.func, // Function to call when the color option is clicked
    filter: PropTypes.bool, // Indicates if filtering is applied to the color option
    className: PropTypes.string, // Additional CSS class to apply for custom styling
};

ColorOptionRender.defaultProps = {
    selected: false,
    onClick: null,
    filter: false,
    className: "",
};

// Utilities

// Restricts input to alphabet characters only
export const onlyAlphabets = (e) => {
    const regex = /^[a-zA-Z ]*$/;
    if (!regex.test(e.key)) {
        e.preventDefault();
    }
};

/**
 * Prevents numbers outside the range of 1 to 8 from being entered.
 * Allows empty strings to pass through.
 * @param {KeyboardEvent} e - Keyboard event triggered on key press
 */
export const onlyNumbersBetween1And8 = (e) => {
  const regex = /^[1-8]*$/;
  if (e.key !== "Backspace" && e.key !== "Delete" && !regex.test(e.key)) {
    e.preventDefault();
  }
};

/**
 * Prevents numbers outside the range of 1 to 8 from being entered.
 * Allows empty strings to pass through.
 * @param {KeyboardEvent} e - Keyboard event triggered on key press
 */
export const onlyNumbersBetween0And11 = (e) => {
    // Allow numbers 0-9 or 10 and 11
    const regex = /^(0?[0-9]|1[01])$/;
    const value = e.target.value + e.key; // Calculate the value after the keypress
  
    // Prevent input if the key is not Backspace or Delete and the value doesn't match the regex
    if (e.key !== "Backspace" && e.key !== "Delete" && !regex.test(value)) {
      e.preventDefault();
    }
  };

// Scrolls the window to the top
export const scrollTop = () => {
    window.scrollTo(0, 0);
};

// Capitalizes the first letter of a string
export const capitalizeFirstLetter = (string) => {
    if (!string) {return "";}
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Formats a string by replacing underscores with spaces and capitalizing words
export const formatUnderScoreString = (string) => {
    const formattedString = capitalizeFirstLetter(string);
    return formattedString.replaceAll("_", " ");
};

// Checks if an object is empty
export const isEmptyObj = (object) => {
    return Object.keys(object).length === 0;
};

// Formats a name by capitalizing the first letter of each word
export const formattedName = (string) => {
    return string.split(" ").map(capitalizeFirstLetter).join(" ");
};

// Formats a Medicare Beneficiary Identifier (MBI) by masking or formatting it
export const formatMBID = (mbid, showMBID) => {
    if (!mbid) {return null;}
    return showMBID ? formatMbiNumber(mbid) : `****-***-${mbid.slice(-4)}`;
};

// Formats a string as an MBI number
export const formatMbiNumber = (mbi) => {
    if (!mbi) {return "";}
    let formattedMbi = mbi.replace(/-/g, "");
    if (formattedMbi.length > 4) {
        formattedMbi = `${formattedMbi.slice(0, 4)}-${formattedMbi.slice(4)}`;
    }
    if (formattedMbi.length > 8) {
        formattedMbi = `${formattedMbi.slice(0, 8)}-${formattedMbi.slice(8)}`;
    }
    return formattedMbi.toUpperCase();
};
