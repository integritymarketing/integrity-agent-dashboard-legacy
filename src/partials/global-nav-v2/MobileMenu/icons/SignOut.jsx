import PropTypes from "prop-types";

const SignOut = ({ width = "32", height = "32", strokeColor = "white" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.6338 8.03976V6.60169C10.6338 6.0456 10.8548 5.51228 11.2482 5.11906C11.6415 4.72585 12.1751 4.50494 12.7314 4.50494H25.1851C25.7564 4.4664 26.3199 4.65462 26.7533 5.02875C27.1867 5.40289 27.455 5.93277 27.5001 6.5034V25.4966C27.455 26.0672 27.1867 26.5971 26.7533 26.9712C26.3199 27.3454 25.7564 27.5336 25.1851 27.4951H12.7314C12.1753 27.4948 11.642 27.274 11.2487 26.881C10.8554 26.488 10.6342 25.955 10.6338 25.3992V23.9568"
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.38176 12.1187L4.50047 15.9999M4.50047 15.9999L8.38176 19.8809M4.50047 15.9999L11.616 15.9999L18.7314 15.9998"
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

SignOut.propTypes = {
  /** The width of the icon */
  width: PropTypes.string,
  /** The height of the icon */
  height: PropTypes.string,
  /** The stroke color of the icon */
  strokeColor: PropTypes.string,
};

export default SignOut;
