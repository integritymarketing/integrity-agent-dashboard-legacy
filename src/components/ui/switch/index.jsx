import React from "react";
import PropTypes from "prop-types";
import "./index.scss";

export function Switch({
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
  return (
    <label className="switch">
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
      <span className="slider round"></span>
    </label>
  );
}

export const switchProps = {
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
};
Switch.propTypes = switchProps;

export default Switch;
