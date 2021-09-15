import React from "react";
import "./detailstable.scss";

export default function CellData({ header, subText, secondarySubText }) {
  return (
    <div className="cell-data">
      <div className="header">{header}</div>
      {subText && <div className="subText">{subText}</div>}
      {secondarySubText && (
        <div className="secondarySubText">{secondarySubText}</div>
      )}
    </div>
  );
}
