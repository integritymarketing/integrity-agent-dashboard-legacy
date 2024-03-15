import React from "react";

const Label = function ({ value, size, color, fontWeight, left, width, wordBreak }) {
    const style = {
        fontSize: size || "24px",
        color: color || "#052A63",
        fontWeight: fontWeight || "400",
        marginLeft: left || "0",
        width: width || "auto",
        wordBreak: wordBreak || "normal",
    };

    return <div style={style}>{value}</div>;
};

export default Label;
