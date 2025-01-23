import React from "react";

const ExitIcon = (props) => {
  return (
    <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path
          d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z"
          className="icon-fill--current"
          fillRule="nonzero"
          fill={props.color}
        />
      </g>
    </svg>
  );
};

export default ExitIcon;
