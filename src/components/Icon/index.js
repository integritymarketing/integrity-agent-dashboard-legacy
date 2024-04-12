import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const Icon = ({ altText = "icon", className = "", image, onClick }) => (
    <div onClick={onClick} className={`${className} ${styles.icon}`}>
        {image && <img alt={altText} src={image} className={styles.image} />}
    </div>
);

Icon.propTypes = {
    altText: PropTypes.string,
    className: PropTypes.string,
    image: PropTypes.string,
    onClick: PropTypes.func,
};

export default Icon;
