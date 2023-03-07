import React from "react";
import "./detailstable.scss";

export default function CellData({ header, subText, secondarySubText }) {
  return (
    <div className="cell-data">
      {subText && <div className="subText">{subText}</div>}
      <div className="header">{header}</div>
      {secondarySubText && (
        <div className="secondarySubText">{secondarySubText}</div>
      )}
    </div>
  );
}
