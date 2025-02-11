import PropTypes from "prop-types";

const MenuOpen = ({ width = "32", height = "32", fillColor = "white" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6.99829H22.2435M4 25.0018H22.2435M4 16H22.5"
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24.9988 22.0012L31 16.0001L24.9988 9.9989"
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

MenuOpen.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fillColor: PropTypes.string,
};

export default MenuOpen;
