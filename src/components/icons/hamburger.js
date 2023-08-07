import React from "react";

const HamburgerIcon = (props) => {
  return (
    <svg width="18" height="12" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path
          d="M0 0h18v2H0V0m0 5h18v2H0V5m0 5h18v2H0v-2z"
          className="icon-fill--current"
        />
      </g>
    </svg>
  );
};

export default HamburgerIcon;
