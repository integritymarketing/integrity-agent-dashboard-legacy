import * as React from "react";

const CallRecording = (props) => (
  <svg
    id="a"
    data-name="Layer 2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="16px"
    height="16px"
    {...props}
  >
    <defs>
      <style>
        {
          ".c{fill:none;stroke:#0052ce;strokeLinecap:round;strokeLinejoin:round}"
        }
      </style>
    </defs>
    <g id="b" data-name="headset">
      <path
        className="c"
        d="M2.46 10.93S.5 10.35.5 9.63V7.67c0-1.3 1.96-1.3 1.96-1.3v4.57ZM13.54 10.93s1.96-.58 1.96-1.3V7.67c0-1.3-1.96-1.3-1.96-1.3v4.57ZM14.2 10.93c0 2.61-2.27 3.89-4.57 3.91"
      />
      <path
        className="c"
        d="M8.98 15.5H7.02c-.36 0-.65-.29-.65-.65h0c0-.36.29-.65.65-.65h1.96c.36 0 .65.29.65.65h0c0 .36-.29.65-.65.65ZM13.54 6.37v-.33A5.54 5.54 0 0 0 8 .5h0a5.54 5.54 0 0 0-5.54 5.54v.33"
      />
    </g>
    <path
      className="c"
      d="M4.44 8h1.19l.5-1 .42 2.81 1.08-4.96.83 6.48L9.63 6l1.08 2h1.2"
    />
  </svg>
);

export default CallRecording;
