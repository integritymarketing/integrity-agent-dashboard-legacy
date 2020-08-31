import React from "react";

export default (props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 16A8 8 0 118 0a8 8 0 010 16zM8 .7a7.3 7.3 0 100 14.6A7.3 7.3 0 008 .7zm3.61 6.35v-.87h-1.45l.34-2.08h-.96L9.2 6.18H7.36L7.7 4.1h-.98l-.34 2.08H4.9v.87h1.33l-.31 1.9H4.4v.86h1.38l-.35 2.1h.98l.35-2.1H8.6l-.34 2.1h.97l.35-2.1h1.52v-.86H9.7l.32-1.9h1.59zm-2.87 1.9H6.9l.31-1.9h1.84l-.31 1.9z"
        className="icon-fill--current"
        fill-rule="evenodd"
      />
    </svg>
  );
};
