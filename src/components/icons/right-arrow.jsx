import React from "react";

const RightArrow = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 8.5 16"
      width={"16px"}
      height={"16px"}
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
      <polyline className="b" points=".5 .5 8 8 .5 15.5" />
    </svg>
  );
};

export default RightArrow;
