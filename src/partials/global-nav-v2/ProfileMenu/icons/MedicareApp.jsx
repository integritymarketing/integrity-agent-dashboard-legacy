import PropTypes from "prop-types";

const MedicareApp = ({
  width = "23",
  height = "23",
  fillColor = "#4178FF",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.8 13.9V22.4C21.8 23.6 20.8 24.5 19.7 24.5H2.6C1.4 24.5 0.5 23.5 0.5 22.4V5.4C0.5 4.2 1.5 3.3 2.6 3.3H11.1M17.7 3L22 7.3M10.1 14.9L9 16M14.3 14.9H10V10.6L19.9 0.8C20.3 0.4 21 0.4 21.4 0.8L24.1 3.5C24.5 3.9 24.5 4.6 24.1 5L14.2 14.9H14.3Z"
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

MedicareApp.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fillColor: PropTypes.string,
};

export default MedicareApp;
