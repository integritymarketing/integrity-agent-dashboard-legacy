import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import styles from "./styles.module.scss";

const LIFE = "LIFE";
const HEALTH = "HEALTH";

function Layout({ setLayout, layout }) {
    const onSelectHandle = (type) => {
        setLayout(type);
        localStorage.setItem("currentType", type);
    };
    return (
        <Box className={styles.layoutContainer}>
            <Box
                className={`${styles.selection} ${layout === LIFE && styles.activeLayout}`}
                onClick={() => onSelectHandle(LIFE)}
            >
                Life Script
            </Box>
            <Box
                className={`${styles.selection} ${layout === HEALTH && styles.activeLayout}`}
                onClick={() => onSelectHandle(HEALTH)}
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
