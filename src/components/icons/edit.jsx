import React from "react";

export default (props) => {
  return (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path d="M-2-2h24v24H-2z" />
        <path
          d="M16.73.72a2.23 2.23 0 00-3.08 0L.36 14.02a.93.93 0 00-.27.66v4.34c0 .51.42.93.93.93l4.33.01c.25 0 .49-.1.66-.27L19.33 6.4c.85-.84.86-2.22 0-3.07L16.74.72zM5.99 17.08l-3.03-3.02 8-8L14 9.1l-8.01 7.98zm-4.04-1.4l2.42 2.41H1.95v-2.41zM18.02 5.09l-2.7 2.7-3.05-3.05 2.7-2.7a.3.3 0 01.44 0L18 4.65c.13.12.13.32 0 .44z"
          className="icon-fill--current"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
};
