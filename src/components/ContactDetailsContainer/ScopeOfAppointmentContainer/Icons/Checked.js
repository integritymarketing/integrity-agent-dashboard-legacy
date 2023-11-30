import React from "react";

export const Checked = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      id="Checkbox"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_13644"
            data-name="Rectangle 13644"
            width="9"
            height="6.429"
            fill="none"
            stroke="#fff"
            strokeWidth="1"
          />
        </clipPath>
      </defs>
      <rect
        id="Rectangle_13667"
        data-name="Rectangle 13667"
        width="24"
        height="24"
        rx="4"
        fill="rgba(255,255,255,0)"
      />
      <g id="input" transform="translate(4 4)" fill="#4178ff">
        <path
          d="M 12 15.5 L 4 15.5 C 2.070090055465698 15.5 0.5 13.92990970611572 0.5 12 L 0.5 4 C 0.5 2.070090055465698 2.070090055465698 0.5 4 0.5 L 12 0.5 C 13.92990970611572 0.5 15.5 2.070090055465698 15.5 4 L 15.5 12 C 15.5 13.92990970611572 13.92990970611572 15.5 12 15.5 Z"
          stroke="none"
        />
        <path
          d="M 4 1 C 2.345789909362793 1 1 2.345789909362793 1 4 L 1 12 C 1 13.65421009063721 2.345789909362793 15 4 15 L 12 15 C 13.65421009063721 15 15 13.65421009063721 15 12 L 15 4 C 15 2.345789909362793 13.65421009063721 1 12 1 L 4 1 M 4 0 L 12 0 C 14.20913982391357 0 16 1.790860176086426 16 4 L 16 12 C 16 14.20913982391357 14.20913982391357 16 12 16 L 4 16 C 1.790860176086426 16 0 14.20913982391357 0 12 L 0 4 C 0 1.790860176086426 1.790860176086426 0 4 0 Z"
          stroke="none"
          fill="#ddd"
        />
      </g>
      <g id="icon-Check" transform="translate(8 9)" clipPath="url(#clip-path)">
        <path
          id="Path_2482"
          data-name="Path 2482"
          d="M.5,3.156,2.767,5.321,7.817.5"
          transform="translate(0.342 0.303)"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};
