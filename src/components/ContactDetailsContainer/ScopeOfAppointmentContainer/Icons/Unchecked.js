import React from "react";

export const Unchecked = ({ className, strokeColor = "#4178ff" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Checkbox"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
    >
      <rect
        id="Rectangle_13667"
        data-name="Rectangle 13667"
        width="24"
        height="24"
        rx="4"
        fill="rgba(255,255,255,0)"
      />
      <g
        id="input"
        transform="translate(4 4)"
        fill="#fff"
        stroke={strokeColor}
        strokeWidth="1"
      >
        <rect width="16" height="16" rx="4" stroke="none" />
        <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="none" />
      </g>
    </svg>
  );
};
