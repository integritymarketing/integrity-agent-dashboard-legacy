import React from "react";

const ArrowDownIcon = ({ fill = "#0052CE", ...props }) => {
  return (
    <svg width="12" height="9" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path
          d="M1.92 1.182L6 5.262l4.08-4.08 1.253 1.262L6 7.778.667 2.444z"
          fill={fill}
        />
      </g>
    </svg>
  );
};

export default ArrowDownIcon;
