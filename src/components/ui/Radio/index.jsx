import React from "react";
import PropTypes from "prop-types";

import "./radio.scss";

function Radio({
  htmlFor = "",
  id = "",
  name = "",
  value = "",
  label = "",
  className,
  onChange,
  checked = false,
}) {
  const theClassName = className ? `radio-label ${className}` : "radio-label";
  return (
    <label htmlFor={htmlFor} className={theClassName}>
      <input
        type="radio"
        className="mr-1"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
      />
      {label}
    </label>
  );
}

Radio.propTypes = {
  htmlFor: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
};

export default Radio;
