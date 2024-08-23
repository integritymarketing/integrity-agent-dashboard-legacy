import { Grid, Stack, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import ArrowForwardWithCircle from "../../icons/version-2/ArrowForwardWithCirlce";
import styles from "./styles.module.scss";
import bannerImage from "images/PlanEnrollBanner.svg";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const MarketingBanner = ({ page }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const navigateToCreateCampaignInvitation = () => {
        setCurrentPage(page);
        navigate("/marketing/campaign-invitation");
    };
    return (
        <Grid container className={styles.marketingBanner}>
            <Grid item md={6} xs={5}>
                <img className={styles.bannerCardImage} src={bannerImage} alt="Click here" />
            </Grid>
            <Grid item md={6} xs={7} className={styles.bannerGridItem}>
                <Stack direction="column" spacing={1} alignItems={"center"}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: isMobile ? "16px" : "20px",
                            fontWeight: 500,
                            color: "#052A63",
                        }}
                    >
                        Get Synced
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: isMobile ? "12px" : "14px",
                            color: "#434A51",
                            textAlign: "center",
                        }}
                    >
                        Enable two-way client record updating
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        endIcon={<ArrowForwardWithCircle />}
                        onClick={navigateToCreateCampaignInvitation}
                    >
                        Send an Invite
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};
MarketingBanner.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string.isRequired,
};

export default MarketingBanner;
