import React from "react";

const LoadingIcon = (props) => {
  return (
    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle
        cx="16"
        cy="16"
        r="12"
        fill="none"
        strokeWidth="4"
        strokeDasharray="50 25.3982"
        stroke="#236c9e"
        className="icon-spin"
      />
    </svg>
  );
};

export default LoadingIcon;
