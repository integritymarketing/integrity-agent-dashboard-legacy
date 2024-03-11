import React from "react";

import "./detailstable.scss";

export default function CellData({ header, subText, secondarySubText, useFor = null, style }) {
    return (
        <>
            {useFor === "pharmacy" ? (
                <div className="cell-data">
                    <div className="header">{header}</div>
                    {secondarySubText && <div className="secondarySubText ph">{secondarySubText}</div>}
                    {subText && <div className="subText pharmacy-address">{subText}</div>}
                </div>
            ) : (
                <div className={`cell-data ${style}`}>
                    {subText && <div className="subText">{subText}</div>}
                    <div className="header">{header}</div>
                    {secondarySubText && <div className="secondarySubText">{secondarySubText}</div>}
                </div>
            )}
        </>
    );
}