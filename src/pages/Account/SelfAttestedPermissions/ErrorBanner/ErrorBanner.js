import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import { Button } from "components/ui/Button";

import styles from "./styles.module.scss";

function ErrorBanner({ retry }) {
    return (
        <Box className={styles.errorBanner}>
            <Box>
                An error has occurred. Please try again later. If the issue persists, please contact
                <a href="mailto:support@clients.integrity.com" className={styles.cta}>
                    support@clients.integrity.com
                </a>
            </Box>
            <Button label="Try Again" className={styles.buttonWithIcon} onClick={retry} type="primary" />
        </Box>
    );
}
ErrorBanner.propTypes = {
    retry: PropTypes.func,
};

export default ErrorBanner;
