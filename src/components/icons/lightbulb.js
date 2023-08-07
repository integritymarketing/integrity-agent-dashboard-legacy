import React from "react";

const LightbulbIcon = (props) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19 10h3v2h-3v-2M0 10h3v2H0v-2M12 0v3h-2V0h2M3.92 2.5l2.13 2.14-1.42 1.41L2.5 3.93 3.92 2.5m12.03 2.13l2.12-2.13 1.43 1.43-2.13 2.12-1.42-1.42M11 5a6 6 0 013 11.2V18a1 1 0 01-1 1H9a1 1 0 01-1-1v-1.8A6.01 6.01 0 0111 5m2 15v1a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1h4m-3-3h2v-2.13a4 4 0 10-2 0V17z"
        fill="#333"
      />
    </svg>
  );
};

export default LightbulbIcon;
