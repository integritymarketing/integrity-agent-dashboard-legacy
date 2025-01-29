import { Grid, Typography } from "@mui/material";
import MarketingBanner from "../MarketingBanner";
import styles from "./styles.module.scss";

const MarketingInfo = () => (
    <Grid direction="column" className={styles.infoBox}>
        <Grid item direction="column" alignItems="center" spacing={1}>
            <Grid item>
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: "32px",
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
                    fontSize: "16px",
                    textAlign: "center",
                    color: "#434A51",
                }}
                gutterBottom={false}
            >
            </Typography>
        </Grid>
        <Grid item sx={{ marginTop: "24px", width: "100%" }}>
            <MarketingBanner page="Marketing" />
        </Grid>
    </Grid>
);

export default MarketingInfo;
