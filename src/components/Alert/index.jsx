import { Alert, AlertTitle, Stack, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";

const AlertMessage = ({ status, title, message }) => {
    return (
        <Stack sx={{ width: "100%" }}>
            <Alert severity={status} sx={{ borderRadius: "8px" }}>
                <AlertTitle color="#434A51">{title}</AlertTitle>
                <Box>
                    <Typography variant="body2" color="#434A51">
                        {message}
                    </Typography>
                </Box>
            </Alert>
        </Stack>
    );
};

AlertMessage.propTypes = {
    status: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
};

export default AlertMessage;
