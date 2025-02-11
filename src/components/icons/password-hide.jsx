import React from "react";

const PasswordHideIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="13.333"
      viewBox="0 0 30 20"
      {...props}
    >
      <path
        d="M15 20C7.09 20 0 12.31 0 10S7.09 0 15 0s15 7.69 15 10-7.09 10-15 10zM2.01 10c.43 1.38 6.02 8 12.99 8s12.56-6.62 12.99-8C27.56 8.62 21.97 2 15 2S2.44 8.62 2.01 10zM15 15.5a5.5 5.5 0 115.5-5.5 5.51 5.51 0 01-5.5 5.5zm0-9a3.5 3.5 0 103.5 3.5A3.5 3.5 0 0015 6.5z"
        className="icon-fill--current"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default PasswordHideIcon;
