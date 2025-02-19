import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { CustomModal } from "components/MuiComponents";

const CoverageTypeInfoModal = ({ open, onClose }) => {
    return (
        <CustomModal
            title="Coverage Type"
            open={open}
            handleClose={onClose}
            showCloseButton
            maxWidth="sm"
            disableContentBackground
            shouldShowCancelButton={false}
        >
            <Box className={styles.modalSection}>
                <Typography variant="h5" color="#052A63" marginBottom={1}>
                    Select the policy coverage type:
                </Typography>
                <Typography variant="body2" color="#434A51" marginBottom={1}>
                    <span className={styles.boldText}>Level - </span> Simplified Underwriting & Level Death Benefit.
                </Typography>

                <Typography variant="body2" color="#434A51" marginBottom={1}>
                    <span className={styles.boldText}>Graded/Modified -</span> Simplified Underwriting with Graded or
                    Reduced Benefits.
                </Typography>

                <Typography variant="body2" color="#434A51" marginBottom={1}>
                    <span className={styles.boldText}>Guaranteed -</span> Guaranteed Issue Policies.
                </Typography>
                <Typography variant="body2" color="#434A51">
                    <span className={styles.boldText}>Limited Pay -</span> Simplified Whole Life Policies with a
                    specified number of premium payments.
                </Typography>
            </Box>
        </CustomModal>
    );
};

CoverageTypeInfoModal.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default CoverageTypeInfoModal;
