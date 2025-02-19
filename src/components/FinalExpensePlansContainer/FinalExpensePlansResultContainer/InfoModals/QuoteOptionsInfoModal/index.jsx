import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { CustomModal } from "components/MuiComponents";

const QuoteOptionsInfoModal = ({ open, onClose }) => {
    return (
        <CustomModal
            title="Quote Options"
            open={open}
            handleClose={onClose}
            showCloseButton
            maxWidth="sm"
            disableContentBackground
            shouldShowCancelButton={false}
        >
            <Box className={styles.modalSection}>
                <Typography variant="body2" color="#434A51" marginBottom={1}>
                    <span className={styles.boldText}>My Appointed Products</span> will only show products from carriers
                    listed in your selling preferences.
                </Typography>

                <Typography variant="body2" color="#434A51" marginBottom={1}>
                    <span className={styles.boldText}> Showing excluded products</span> will display products excluded
                    from your results due to policy limits or underwriting criteria.
                </Typography>

                <Typography variant="body2" color="#434A51">
                    <span className={styles.boldText}> Showing alternative products</span> will display alternative
                    coverage types if your selected coverage type is not available.
                </Typography>
            </Box>
        </CustomModal>
    );
};

QuoteOptionsInfoModal.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default QuoteOptionsInfoModal;
