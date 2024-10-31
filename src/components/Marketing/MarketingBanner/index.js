import { Grid, Stack, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import ArrowForwardWithCircle from "../../icons/version-2/ArrowForwardWithCircle";
import styles from "./styles.module.scss";
import bannerImage from "images/PlanEnrollBanner.svg";
import PropTypes from "prop-types";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import useToast from "hooks/useToast";

const MarketingBanner = ({ page, leadDetails = null }) => {
    const showToast = useToast();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { setCurrentPage, handleCreateCampaignFromContact } = useCampaignInvitation();

    const navigateToCreateCampaignInvitation = () => {
        if (!leadDetails?.emails[0]?.leadEmail && !leadDetails?.phones[0]?.leadPhone) {
            showToast({
                type: "error",
                message: "Cannot send campaign: This contact does not have a phone number.",
                time: 5000,
            });
            return;
        }
        setCurrentPage(page);
        if (leadDetails) {
            let campaignChannel = "";
            if (leadDetails?.contactPreferences?.primary === "email" && leadDetails?.emails[0]?.leadEmail) {
                campaignChannel = "Email";
            } else if (leadDetails?.contactPreferences?.primary === "phone" && leadDetails?.phones[0]?.leadPhone) {
                campaignChannel = "Sms";
            } else {
                campaignChannel = "Email";
            }
            const campaignTitle = `${leadDetails?.firstName} ${leadDetails?.lastName} Get Sync`;
            const lead = {
                leadsId: leadDetails?.leadsId,
                firstName: leadDetails?.firstName,
                lastName: leadDetails?.lastName,
                destination: leadDetails?.emails[0]?.leadEmail,
            };
            handleCreateCampaignFromContact({
                campaignChannel,
                campaignTitle,
                customCampaign: "PlanEnrollProfile",
                actionType: "a contact",
                lead,
            });
        }
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
    page: PropTypes.string.isRequired,
    leadDetails: PropTypes.shape({
        emails: PropTypes.arrayOf(
            PropTypes.shape({
                leadEmail: PropTypes.string,
            })
        ),
    }),
};

export default MarketingBanner;
