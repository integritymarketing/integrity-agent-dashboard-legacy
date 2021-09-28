import React from "react";
import PropTypes from "prop-types";

import Checkbox, { checkboxProps } from "../Checkbox";
import "./checkboxGroup.scss";

function CheckboxGroup({ checkboxes }) {
  return (
    <div className="checkbox-group">
      {checkboxes.map((box) => {
        return <Checkbox key={box.label} disabled={box.disabled} onChange={(event)=>box.onChange(event.target.value)} {...box} />;
      })}
    </div>
  );
}

CheckboxGroup.propTypes = {
  checkboxes: PropTypes.arrayOf(PropTypes.shape(checkboxProps)),
};

export default CheckboxGroup;
