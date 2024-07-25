import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const TextInput = ({ label = "", ...props }) => {
    return (
        <Box>
            <Box className={styles.labelContainer}>
                <Typography
                    sx={{
                        fontSize: "16px",
                        color: "#052a63",
                        marginBottom: "4px",
                        fontWeight: 600,
                    }}
                >
                    {label}
                </Typography>
            </Box>
            <TextField {...props} />
        </Box>
    );
};

TextInput.propTypes = {
    /** Label for the text input field */
    label: PropTypes.string.isRequired,
    /** Additional props to be passed to the TextField component */
    props: PropTypes.object,
};

export default TextInput;
