import React from "react";

const RoundCheckIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_13644"
            data-name="Rectangle 13644"
            width="9"
            height="7"
            fill="none"
            stroke="#0052ce"
            strokeWidth="1"
          />
        </clipPath>
      </defs>
      <g id="Group_3373" data-name="Group 3373" transform="translate(-123 -18)">
        <g
          id="Ellipse_283"
          data-name="Ellipse 283"
          transform="translate(123 18)"
          fill="#fff"
          stroke="#0052ce"
          strokeWidth="1"
        >
          <circle cx="8" cy="8" r="8" stroke="none" />
          <circle cx="8" cy="8" r="7.5" fill="none" />
        </g>
        <g id="icon-Check" transform="translate(127 23)">
          <g id="Group_1635" data-name="Group 1635" clipPath="url(#clip-path)">
            <path
              id="Path_2482"
              data-name="Path 2482"
              d="M.5,3.393,2.767,5.75,7.817.5"
              transform="translate(0.342 0.375)"
              fill="none"
              stroke="#0052ce"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default RoundCheckIcon;
