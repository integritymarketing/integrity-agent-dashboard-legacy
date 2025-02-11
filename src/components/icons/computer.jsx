import React from "react";

const ComputerIcon = (props) => {
  return (
    <svg
      width="24"
      height="16"
      viewBox="0 0 24 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <path
          d="M4 2h16v10H4m16 2a2 2 0 002-2V2a2 2 0 00-2-2H4a2 2 0 00-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4z"
          className="icon-fill--current"
        />
      </g>
    </svg>
  );
};

export default ComputerIcon;
