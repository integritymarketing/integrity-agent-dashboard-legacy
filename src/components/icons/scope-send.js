import React from "react";

const ScopeSendIcon = ({ hover }) => {
  const stroke = hover ? "#0052CE" : "#6A7279";
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 1.5L8.75 9.75"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 1.5L11.75 16.5L8.75 9.75L2 6.75L17 1.5Z"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ScopeSendIcon;
