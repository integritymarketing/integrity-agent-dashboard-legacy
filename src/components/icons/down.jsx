import React from "react";

const DownIcon = ({ color, width = 17, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="10"
      viewBox="0 0 15 9"
      {...props}
    >
      <path
        id="Path_2504"
        data-name="Path 2504"
        d="M12.5,8l-6,6L.5,8"
        transform="translate(0.207 -7.293)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
    </svg>
  );
};

export default DownIcon;