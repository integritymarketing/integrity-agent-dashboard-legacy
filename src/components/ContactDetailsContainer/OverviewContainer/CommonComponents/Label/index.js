import React from "react";

const Label = function ({ value, size, color, fontWeight, left }) {
    const style = {
        fontSize: size || "24px",
        color: color || "#052A63",
        fontWeight: fontWeight || "400",
        marginLeft: left || "0",
    };

    return <div style={style}>{value}</div>;
};

export default Label;
