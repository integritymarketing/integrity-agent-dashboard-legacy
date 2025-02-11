import { Typography, Container, Box } from "@mui/material";
import CompletedCampaignsList from "./CompletedCampaignsList";
import { useMarketing } from "providers/Marketing";
import NoCampaignListCard from "./NoCampaignListCard";
import styles from "./CampaignsListContainer.module.scss";

const CampaignsListContainer = () => {
    const { completedCampaignsList = [] } = useMarketing();

    return (
        <Container
            sx={{
                paddingTop: "40px",
            }}
        >
            <Box className={styles.header}>
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: "32px",
                        textAlign: "center",
                        color: "#052A63",
                        marginBottom: "8px",
                    }}
                >
                    Completed Campaigns
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        fontSize: "16px",
                        textAlign: "center",
                        color: "#434A51",
                    }}
                >
                    Client Marketing Campaigns that are currently running
                </Typography>
            </Box>
            {completedCampaignsList.length > 0 ? <CompletedCampaignsList /> : <NoCampaignListCard />}
        </Container>
    );
};

export default CampaignsListContainer;
