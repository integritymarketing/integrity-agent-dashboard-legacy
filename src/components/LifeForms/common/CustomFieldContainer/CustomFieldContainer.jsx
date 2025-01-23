import PropTypes from "prop-types";
import { Stack, Typography } from "@mui/material";
import styles from "./CustomFieldContainer.module.scss";

function CustomFieldContainer({ label, error, children, style }) {
    return (
        <>
            <Stack spacing={1} style={style} flex={1}>
                <Stack flex>
                    <Typography className={styles.fieldHeaderLabel}>{label}</Typography>
                </Stack>
                {children}
            </Stack>
            {error ? (
                <Typography variant="caption" color="red">
                    {error}
                </Typography>
            ) : (
                ""
            )}
        </>
    );
}

CustomFieldContainer.propTypes = {
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    children: PropTypes.element,
    style: PropTypes.object,
};

export default CustomFieldContainer;
