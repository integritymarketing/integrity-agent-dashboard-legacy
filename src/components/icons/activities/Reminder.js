import * as React from "react";

const Reminder = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16.7 20"
    style={{
      enableBackground: "new 0 0 16.7 20",
    }}
    xmlSpace="preserve"
    width="16px"
    height="16px"
    {...props}
  >
    <path
      d="M16.6 16.7c-1.2-1.7-1.9-3.8-2-5.9V6.7C14.7 3.1 11.9.2 8.4 0 4.8.2 2 3.1 2.1 6.7v4.1c-.1 2.1-.8 4.2-2 5.9-.1.2-.1.4 0 .5.1.2.3.3.4.3h5.3c.1 1.4 1.3 2.5 2.7 2.4 1.3-.1 2.3-1.1 2.4-2.4h5.3c.2 0 .4-.1.4-.3.1-.1.1-.3 0-.5zM8.4 19c-.8 0-1.5-.7-1.6-1.5h3.1c0 .8-.7 1.5-1.5 1.5zm2-2.5h-9c1-1.7 1.6-3.7 1.7-5.7V6.7C3 3.7 5.3 1.2 8.4 1c3 .2 5.3 2.7 5.3 5.7v4.1c.1 2 .6 4 1.7 5.7h-5z"
      style={{
        fill: "#0052ce",
      }}
    />
  </svg>
);

export default Reminder;
