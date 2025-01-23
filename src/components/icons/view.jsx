import React from "react";

export default ({ size = 32 }) => {
  return (
    <svg
      id="View"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
    >
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_20850"
            data-name="Rectangle 20850"
            width="16"
            height="16"
            fill="none"
          />
        </clipPath>
      </defs>
      <g id="IconBG">
        <circle
          id="Ellipse_299"
          data-name="Ellipse 299"
          cx="16"
          cy="16"
          r="16"
          fill="#deebfb"
        />
      </g>
      <g id="Group_3326" data-name="Group 3326" transform="translate(8 8)">
        <g id="Group_3325" data-name="Group 3325" clipPath="url(#clip-path)">
          <path
            id="Path_3517"
            data-name="Path 3517"
            d="M14.2,8.652v5.657A1.191,1.191,0,0,1,13.005,15.5H1.691A1.191,1.191,0,0,1,.5,14.309V2.995A1.191,1.191,0,0,1,1.691,1.8H7.348"
            fill="none"
            stroke="#0052ce"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
          />
          <line
            id="Line_1047"
            data-name="Line 1047"
            x2="3.913"
            transform="translate(11.587 0.5)"
            fill="none"
            stroke="#0052ce"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
          />
          <line
            id="Line_1048"
            data-name="Line 1048"
            y1="3.913"
            transform="translate(15.5 0.5)"
            fill="none"
            stroke="#0052ce"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
          />
          <line
            id="Line_1049"
            data-name="Line 1049"
            y1="7.174"
            x2="7.174"
            transform="translate(8.326 0.5)"
            fill="none"
            stroke="#0052ce"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
          />
        </g>
      </g>
    </svg>
  );
};
