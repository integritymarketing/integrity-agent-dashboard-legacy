import PropTypes from "prop-types";
import styles from "./MessageCard.module.scss";

const DateTimeBox = ({ formattedDate, formattedTime }) => (
    <div className={styles.dateTimeBox}>
        <span className={styles.timeText}>{formattedDate}</span>
        <br />
        {formattedTime}
    </div>
);

DateTimeBox.propTypes = {
    formattedDate: PropTypes.string.isRequired,
    formattedTime: PropTypes.string.isRequired,
};

export default DateTimeBox;