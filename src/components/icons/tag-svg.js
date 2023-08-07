import React from "react";

const TagSvg = (props) => {
  return (
    <svg
      id="Tag-Sm"
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 32 32"
    >
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_13684"
            data-name="Rectangle 13684"
            width="16"
            height="10.589"
            transform="translate(0 0)"
            fill="none"
          />
        </clipPath>
      </defs>
      <g id="IconBG" transform="translate(0 0)">
        <circle
          id="Ellipse_299"
          data-name="Ellipse 299"
          cx="16"
          cy="16"
          r="16"
          fill="rgba(33,117,244,0.1)"
        />
      </g>
      <g id="Icon_Tag" data-name="Icon Tag">
        <path
          id="Path_3530"
          data-name="Path 3530"
          d="M4,0H28a4,4,0,0,1,4,4V28a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z"
          fill="rgba(255,255,255,0)"
        />
        <g
          id="Group_1713"
          data-name="Group 1713"
          transform="translate(8 11)"
          clipPath="url(#clip-path)"
        >
          <path
            id="Path_2521"
            data-name="Path 2521"
            d="M.5,1.116V9.472a.616.616,0,0,0,.616.617H10.7a.614.614,0,0,0,.436-.181L15.319,5.73a.616.616,0,0,0,0-.872L11.141.68A.617.617,0,0,0,10.7.5H1.116A.616.616,0,0,0,.5,1.116Z"
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

export default TagSvg;
