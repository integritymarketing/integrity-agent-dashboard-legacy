import React from "react";
import PropTypes from "prop-types";
import AbcBannerImage from "images/AbcBannerImage.png";
import { Box, Typography, Grid, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles.module.scss";

// Main Banner Component
const AbcGetStartBanner = ({ onClose, onLearnMore }) => {
    return (
        <Box className={styles.bannerContainer}>
            <Grid container spacing={2} alignItems="center">
                {/* Logo Section */}
                <Grid item xs={12} md={9} sm={9}>
                    <Box className={styles.imageAndContent}>
                        <Box className={styles.logo}>
                            <img src={AbcBannerImage} alt="ABC Logo" />
                        </Box>
                        <Box className={styles.textContent}>
                            <Typography variant="h4" color="#052A63">
                                Join the Coalition
                            </Typography>
                            <Typography variant="body2" color="#434A51" className={styles.description}>
                                Help your clients safeguard their Medicare options by encouraging them to make their
                                voices heard.
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                {/* Action Buttons Section */}

                <Grid item xs={12} md={3} sm={3} className={styles.learnMoreButton}>
                    <Button
                        variant="contained"
                        size="large"
                        color="error"
                        onClick={onLearnMore}
                        className={styles.customBorderButton}
                    >
                        Learn More
                    </Button>
                    <Box onClick={onClose} className={styles.closeButton}>
                        <CloseIcon />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

// PropTypes for component
AbcGetStartBanner.propTypes = {
    onClose: PropTypes.func, // Function to handle close action
    onLearnMore: PropTypes.func, // Function to handle "Learn More" button click
};

export default AbcGetStartBanner;
