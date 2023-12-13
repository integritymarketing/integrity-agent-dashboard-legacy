import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import styles from "./styles.module.scss";

const LIFE = "LIFE";
const HEALTH = "HEALTH";

function Layout({ setLayout, layout }) {
    return (
        <Box className={styles.layoutContainer}>
            <Box
                className={`${styles.selection} ${layout === LIFE && styles.activeLayout}`}
                onClick={() => setLayout(LIFE)}
            >
                Life Script
            </Box>
            <Box
                className={`${styles.selection} ${layout === HEALTH && styles.activeLayout}`}
                onClick={() => setLayout(HEALTH)}
            >
                Health Script
            </Box>
        </Box>
    );
}

Layout.propTypes = {
    setLayout: PropTypes.func.isRequired,
    layout: PropTypes.string.isRequired,
};

export default Layout;
