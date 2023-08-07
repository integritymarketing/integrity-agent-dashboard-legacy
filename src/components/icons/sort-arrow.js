import React from "react";

const SortArrow = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0.11in"
      height="0.17in"
      viewBox="0 0 8 12"
    >
      <path
        d="M4,12a.47.47,0,0,1-.35-.15L.15,8.35a.48.48,0,0,1,0-.7.48.48,0,0,1,.7,0L4,10.79,7.15,7.65a.49.49,0,0,1,.7.7l-3.5,3.5A.47.47,0,0,1,4,12Z"
        fill="#0052ce"
      />
      <path
        d="M7.5,4.5a.47.47,0,0,1-.35-.15L4,1.21.85,4.35a.48.48,0,0,1-.7,0,.48.48,0,0,1,0-.7L3.65.15a.48.48,0,0,1,.7,0l3.5,3.5a.48.48,0,0,1,0,.7A.47.47,0,0,1,7.5,4.5Z"
        fill="#0052ce"
      />
    </svg>
  );
};

export default SortArrow;
