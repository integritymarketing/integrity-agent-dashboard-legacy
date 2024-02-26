import PropTypes from 'prop-types'; 
import { Link } from 'react-router-dom';

import { altText } from './constants';

import styles from './styles.module.scss';

const Logo = ({ className, color }) => {
    const imageSrc = `/images/logo-${color}.svg`;

    return (
        <Link className={styles.logo} to="/">
            <img alt={altText} className={`${className} ${styles.image}`} src={imageSrc} />
        </Link>
    );
};

Logo.propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
};

Logo.defaultProps = {
    className: '',
    color: 'blue', 
};

export default Logo;
