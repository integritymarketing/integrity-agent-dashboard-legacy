import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import CampaignsList from "../CampaignsList";
import CampaignNoDataCard from "../CampaignNoDataCard";
import { filterCampaignsByStatus } from "utils/shared-utils/sharedUtility";
import styles from "./styles.module.scss";
import { MetricRecipients, MetricOpens, MetricClicks, MetricUnsubscribes } from "@integritymarketing/icons";

const CampaignListContainer = ({ data, campaigns, status }) => {
    let campaigns_List = [];

    const statusInfo = [
        { count: 0, statusName: "Delivered", leadIds: [], showPercentage: null, icon: MetricRecipients },
        { count: 0, statusName: "open", leadIds: [], showPercentage: null, icon: MetricOpens },
        { count: 0, statusName: "clicked", leadIds: [], showPercentage: null, icon: MetricClicks },
        { count: 0, statusName: "UnSubscribed", leadIds: [], showPercentage: null, icon: MetricUnsubscribes },
    ];

    const calPercentage = (statusCount, list) => {
        const count = statusCount.find((item) => item.statusName === "Delivered")?.count || 0;

        if (list.statusName === "Delivered") {
            return null;
        } else if (["open", "clicked", "UnSubscribed"].includes(list.statusName)) {
            const per = count === 0 ? 0 : (list.count / count) * 100;
            return `${Math.round(per)}%`;
        }

        return "0";
    };

    if (status === "Completed") {
        const order = ["Delivered", "open", "clicked", "UnSubscribed"];
        const icons = [MetricRecipients, MetricOpens, MetricClicks, MetricUnsubscribes];
        campaigns_List = filterCampaignsByStatus(campaigns, status)?.map((campaign) => ({
            ...campaign,
            statusCounts:
                campaign.campaignChannel === "Email"
                    ? campaign.statusCounts
                          ?.filter((item) => item.statusName !== "dropped")
                          ?.sort((a, b) => {
                              return order.indexOf(a.statusName) - order.indexOf(b.statusName);
                          })
                          ?.map((item, index) => ({
                              ...item,
                              icon: icons[index],
                              showPercentage: calPercentage(campaign.statusCounts, item),
                          }))
                          ?.filter((item) => {
                              return !(item.statusName === "UnSubscribed" && item.count === 0);
                          })
                    : statusInfo,
        }));
    } else {
        campaigns_List = filterCampaignsByStatus(campaigns, status);
    }
    return (
        <Box className={styles.campaignListContainer}>
            <Typography variant="h2" className={styles.title}>
                {data.title}
            </Typography>
            <Typography variant="body1" className={styles.body}>
                {data.body}
            </Typography>
            {campaigns_List?.length > 0 ? (
                <CampaignsList title="Drafts" campaigns={campaigns_List} />
            ) : (
                <CampaignNoDataCard message={data?.message} />
            )}
        </Box>
    );
};

CampaignListContainer.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        message: PropTypes.string,
    }).isRequired,
    campaigns: PropTypes.arrayOf(PropTypes.object).isRequired,
    status: PropTypes.string.isRequired,
};

export default CampaignListContainer;
