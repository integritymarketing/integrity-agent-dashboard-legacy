import PropTypes from "prop-types";

const MedicareLink = ({
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
      d="M12.5 8.4L14.9 6C15.8 5.1 17.4 5.1 18.3 6L19 6.7C19.9 7.6 19.9 9.2 19 10.1L15.2 13.9C14.3 14.8 12.7 14.8 11.8 13.9L11.1 13.2M12.5 16.6L10.1 19C9.2 19.9 7.6 19.9 6.7 19L6 18.3C5.1 17.4 5.1 15.8 6 14.9L9.8 11.1C10.7 10.2 12.3 10.2 13.2 11.1L13.9 11.8M2.9 0.5H22.1C23.4255 0.5 24.5 1.57452 24.5 2.9V22.1C24.5 23.4255 23.4255 24.5 22.1 24.5H2.9C1.57452 24.5 0.5 23.4255 0.5 22.1V2.9C0.5 1.57452 1.57452 0.5 2.9 0.5Z"
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

MedicareLink.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fillColor: PropTypes.string,
};

export default MedicareLink;
