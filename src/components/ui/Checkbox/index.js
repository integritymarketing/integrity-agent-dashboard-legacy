import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

function Checkbox({
  htmlFor = "",
  id = "",
  name = "",
  value = "",
  label = "",
  className,
  onChange,
  checked = false,
  disabled = false,
  defaultChecked = false,
}) {
  const theClassName = className
    ? `checkbox-label ${className} ${disabled && "disabled"}`
    : `checkbox-label ${disabled && "disabled"}`;
  return (
    <label htmlFor={htmlFor} className={theClassName}>
      <input
        type="checkbox"
        className="mr-1"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        checked={checked}
      />
      {label}
    </label>
  );
}

export const checkboxProps = {
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
Checkbox.propTypes = checkboxProps;

export default Checkbox;
