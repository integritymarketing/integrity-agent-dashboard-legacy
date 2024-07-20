import PropTypes from "prop-types";

const Dashboard = ({ width = "32", height = "32", fillColor = "white" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.75 9V12H27.25V9C27.25 7.78125 26.2188 6.75 25 6.75H7C5.73438 6.75 4.75 7.78125 4.75 9ZM4.75 24C4.75 25.2656 5.73438 26.25 7 26.25H15.625V12.75H4.75V24ZM16.375 26.25H25C26.2188 26.25 27.25 25.2656 27.25 24V12.75H16.375V26.25ZM4 24V9C4 7.35938 5.3125 6 7 6H25C26.6406 6 28 7.35938 28 9V24C28 25.6875 26.6406 27 25 27H7C5.3125 27 4 25.6875 4 24Z"
      fill={fillColor}
    />
  </svg>
);

Dashboard.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fillColor: PropTypes.string,
};

export default Dashboard;
