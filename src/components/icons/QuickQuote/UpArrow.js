import PropTypes from "prop-types";

const UpArrow = ({ width = "32", height = "33" }) => (
    <svg width={width} height={height} viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M15.3438 9.39844C15.6719 9.07031 16.2734 9.07031 16.6016 9.39844L27.1016 19.8984C27.4297 20.2266 27.4297 20.8281 27.1016 21.1562C26.7734 21.4844 26.1719 21.4844 25.8438 21.1562L16 11.2578L6.10156 21.1562C5.77344 21.4844 5.17188 21.4844 4.84375 21.1562C4.51562 20.8281 4.51562 20.2266 4.84375 19.8984L15.3438 9.39844Z"
            fill="#4178FF"
        />
    </svg>
);

UpArrow.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
};

export default UpArrow;
