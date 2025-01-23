import React from "react";

function Options({ header, subHeader, subSubHeader }) {
  return (
    <div className="option__typeahead">
      <div className="header__typeahead">{header}</div>
      {subHeader && <div className="subHeader__typeahead">{subHeader}</div>}
      {subSubHeader && (
        <div className="subSubHeader__typeahead">{subSubHeader}</div>
      )}
    </div>
  );
}

export default Options;
