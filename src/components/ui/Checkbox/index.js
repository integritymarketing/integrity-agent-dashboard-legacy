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
}) {
  const theClassName = className ? `checkbox-label ${className}` : "checkbox-label";
  return (
    <label htmlFor={htmlFor} className={theClassName}>
      <input
        type="checkbox"
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

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  checked: PropTypes.bool,
};

export default Checkbox;
