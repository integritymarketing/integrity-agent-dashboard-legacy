import React from "react";

export const ColorOptionRender = ({
  value,
  label,
  color,
  selected = false,
  onClick,
  filter,
  className,
}) => {
  const handleClick = (ev) => {
    onClick && onClick(ev, value);
  };
  return (
    <div
      className={`option ${selected ? "selected" : ""} ${
        filter ? className : ""
      }`}
      onClick={handleClick}
    >
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

// Key_validation - Restricting input field to accept only alphabets

export const onlyAlphabets = (e) => {
  const re = /^[a-zA-Z ]*$/;
  if (!re.test(e.key)) {
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
export const onlyNumbersBetween1And12 = (e) => {
  const regex = /^[1-9][0-2]?$/; // Updated regex pattern
  const value = e.target.value + e.key; // Calculate the value after the keypress
  if (e.key !== "Backspace" && e.key !== "Delete" && !regex.test(value)) {
    e.preventDefault();
  }
};

export const scrollTop = () => {
  window.scrollTo(0, 0);
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatUnderScorestring = (str) => {
  let value = str.charAt(0).toUpperCase() + str.slice(1);
  return value.replaceAll("_", " ");
};

export const isEmptyObj = (obj) => {
  for (let i in obj) return false;
  return true;
};

export const formattedName = (str) => {
  const capitalize = (word) => {
    return word.toLowerCase().replace(/\b[a-z]/g, (char) => char.toUpperCase());
  };

  return str.split(" ").map(capitalize).join(" ");
};

export const formatMBID = (mbid, showMBID) => {
  if (!mbid) {
    return null;
  } else if (showMBID) {
    return formatMbiNumber(mbid);
  } else {
    return `****-***-${mbid.slice(-4)}`;
  }
};

export const formatMbiNumber = (value) => {
  if (!value) return "";
  let formattedValue = value.replace(/-/g, "");
  if (formattedValue.length > 4) {
    formattedValue = formattedValue.slice(0, 4) + "-" + formattedValue.slice(4);
  }
  if (formattedValue.length > 8) {
    formattedValue = formattedValue.slice(0, 8) + "-" + formattedValue.slice(8);
  }
  return formattedValue.toUpperCase();
};
