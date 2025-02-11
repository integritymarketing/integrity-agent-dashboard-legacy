import React from "react";

const TagIcon = (props) => {
  return (
    <svg
      width={"16px"}
      height={"16px"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 15.7"
    >
      <defs>
        <style>
          {`.b {
      fill: none;
      stroke: #0052ce;
      strokeLinecap: round;
      strokeLinejoin: round;
    }`}
        </style>
      </defs>
      <path
        className="b"
        d="M.5,1.45V14.26c0,.52,.42,.95,.95,.95h14.7c.25,0,.49-.1,.67-.28l6.41-6.41c.37-.37,.37-.97,0-1.34L16.82,.78c-.18-.18-.42-.28-.67-.28H1.45c-.52,0-.95,.42-.95,.95Z"
      />
      <circle className="b" cx="17.21" cy="7.85" r="1.89" />
    </svg>
  );
};

export default TagIcon;
