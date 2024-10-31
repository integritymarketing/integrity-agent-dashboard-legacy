import PropTypes from "prop-types";
import { Box, Typography, Button } from "@mui/material";
import { CustomModal } from "components/MuiComponents";
import AbcBannerImage from "images/AbcBannerImage.png";

import styles from "./styles.module.scss";

const AbcLearnMoreModal = ({ open = false, onClose = () => {}, handleButtonClick = () => {} }) => {
    return (
        <CustomModal
            title={"Join the Coalition"}
            open={open}
            handleClose={onClose}
            footer={null}
            showCloseButton
            shouldShowCancelButton={false}
            maxWidth="sm"
            disableContentBackground
        >
            <Box className={styles.modalBodyContainer}>
                <Box className={styles.logo}>
                    <img src={AbcBannerImage} alt="ABC Logo" />
                </Box>
                <Box paddingBottom="8px" paddingTop="16px">
                    <Typography variant="h4" color="#052A63">
                        Support Healthcare Options for America
                    </Typography>
                </Box>
                <Box paddingBottom="16px">
                    <Typography variant="body1" color="#434A51">
                        Help your clients safeguard their Medicare options by encouraging them to make their voices
                        heard.
                    </Typography>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        size="large"
                        color="error"
                        onClick={() => handleButtonClick("send_invite")}
                    >
                        Send an Invite
                    </Button>
                </Box>
                <Box className={styles.divider}></Box>
                <Box paddingBottom="8px">
                    <Typography variant="h4" color="#052A63">
                        About the Coalition
                    </Typography>
                </Box>
                <Box paddingBottom="16px">
                    <Typography variant="body1" color="#434A51">
                        Americans for Beneficiary Choice is a broad-based coalition of health insurance industry leaders
                        and workers, consumer advocates and concerned citizens who share a common objective — protecting
                        the best interests of Medicare and other health insurance beneficiaries. The coalition works to
                        improve the American healthcare system by advocating for sensible, forward-thinking policies
                        that improve health insurance knowledge and education, lower healthcare costs, and maximize
                        coverage choice for consumers.
                    </Typography>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        size="medium"
                        color="error"
                        onClick={() => handleButtonClick("learn_more")}
                    >
                        Learn More
                    </Button>
                </Box>
            </Box>
        </CustomModal>
    );
};

AbcLearnMoreModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onClick: PropTypes.func,
};

export default AbcLearnMoreModal;
