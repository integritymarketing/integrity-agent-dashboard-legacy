import React from "react";
import PropTypes from "prop-types";

import "./radio.scss";

function Radio({ htmlFor = "", id = "", name = "", value = "", label = "" }) {
  return (
    <label htmlFor={htmlFor} className="radio-label">
      <input type="radio" className="mr-1" id={id} name={name} value={value} />
      {label}
    </label>
  );
}

Radio.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Radio;
