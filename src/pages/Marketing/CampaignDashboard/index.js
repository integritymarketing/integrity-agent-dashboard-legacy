import { Helmet } from "react-helmet-async";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import styles from "./styles.module.scss";
import { Grid, Typography } from "@mui/material";
import MarketingBanner from "components/CampaignInvitationContainer/MarketingBanner";
import HeaderSection from "components/CampaignInvitationContainer/HeaderSection";
import { useState } from "react";

const InfoBox = () => (
    <Grid container direction="column" className={styles.infoBox}>
        <Grid item container direction="column" alignItems="center" spacing={1}>
            <Grid item>
                <Typography
                    variant="h2"
                    sx={{
                        fontFamily: "Lato",
                        fontSize: "32px",
                        fontWeight: 400,
                        lineHeight: "40px",
                        textAlign: "center",
                        color: "#052A63",
                    }}
                    gutterBottom={false}
                >
                    Get synced with your Clients
                </Typography>
            </Grid>
        </Grid>
        <Grid item>
            <Typography
                variant="body1"
                sx={{
                    fontFamily: "Lato",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "20px",
                    textAlign: "center",
                    color: "#052A63",
                }}
                gutterBottom={false}
            >
                Nulla vitae elit libero, a pharetra augue. Cras mattis consectetur purus sit amet fermentum.
            </Typography>
        </Grid>
        <Grid item sx={{ marginTop: "24px" }}>
            <MarketingBanner />
        </Grid>
    </Grid>
);

export default function CampaignDashboard() {
    const [clientMarketingTitle, setClientMarketingTitle] = useState("Client Marketing");

    return (
        <>
            <Helmet>
                <title>Campaign Dashboard</title>
            </Helmet>
            <div className={styles.backgroundGray}>
                <GlobalNav />
                <HeaderSection title={clientMarketingTitle} />
                <InfoBox />
                <GlobalFooter />
            </div>
        </>
    );
}
