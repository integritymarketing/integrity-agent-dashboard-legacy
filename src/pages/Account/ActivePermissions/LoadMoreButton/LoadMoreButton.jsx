import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import PropTypes from "prop-types";

import Arrow from "components/icons/down";

import styles from "./styles.module.scss";

function LoadMoreButton({ loadMore }) {
    return (
        <Grid container justifyContent="center" className={styles.showMoreRow}>
            <Grid onClick={loadMore} display="flex" alignItems="center" gap={1} className={styles.showMoreLink}>
                <Arrow color="#4178FF" />
                <Box>Show More</Box>
            </Grid>
        </Grid>
    );
}

LoadMoreButton.propTypes = {
    loadMore: PropTypes.func,
};

export default LoadMoreButton;
