import * as React from "react";

const Share = (props) => (
  <svg
    id="a"
    data-name="Layer 2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="6px"
    height="12px"
    {...props}
  >
    <defs>
      <style>
        {
          ".b{fill:none;stroke:#0052ce;strokeLinecap:round;strokeLinejoin:round}"
        }
      </style>
    </defs>
    <path className="b" d="M13.58 11.65v-7.1c0-.95-.77-1.71-1.71-1.71H6.52" />
    <path className="b" d="M8.86.5 6.52 2.84l2.34 2.34" />
    <circle className="b" cx={13.58} cy={13.58} r={1.92} />
    <path className="b" d="M2.42 4.35v7.1c0 .95.77 1.71 1.71 1.71h5.34" />
    <path className="b" d="m7.14 15.5 2.34-2.34-2.34-2.34" />
    <circle className="b" cx={2.42} cy={2.42} r={1.92} />
  </svg>
);

export default Share;
