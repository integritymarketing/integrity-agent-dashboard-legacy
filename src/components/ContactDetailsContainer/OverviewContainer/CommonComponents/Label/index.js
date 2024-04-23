import PropTypes from "prop-types";

const Label = function ({
    value,
    size = "24px",
    color = "#052A63",
    fontWeight = "400",
    left = "0",
    width = "auto",
    wordBreak = "normal",
}) {
    const style = {
        fontSize: size,
        color: color,
        fontWeight: fontWeight,
        marginLeft: left,
        width: width,
        wordBreak: wordBreak,
    };

    return <div style={style}>{value}</div>;
};

Label.propTypes = {
    value: PropTypes.string.isRequired,
    size: PropTypes.string,
    color: PropTypes.string,
    fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    left: PropTypes.string,
    width: PropTypes.string,
    wordBreak: PropTypes.string,
};

export default Label;
