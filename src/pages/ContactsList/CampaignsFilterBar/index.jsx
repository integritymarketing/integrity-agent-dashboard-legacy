import Box from "@mui/material/Box";
import useFilteredLeadIds from "../hooks/useFilteredLeadIds";
import ClearFilterButton from "components/CampaignInvitationContainer/InvitationCountBar/ClearFilterButton";
import { useContactsListContext } from "../providers/ContactsListProvider";
import styles from "./styles.module.scss";

function CampaignsFilterBar() {
    const { refreshData } = useContactsListContext();
    const { removeFilteredLeadIds, campaignsLeadIds, campaignsLeadInfo } = useFilteredLeadIds();
    const count = campaignsLeadIds?.length ?? 0;

    const onClickHandle = () => {
        removeFilteredLeadIds();
        refreshData();
    };

    if (count === 0) {
        return null;
    }

    return (
        <Box className={styles.banner}>
            <Box className={styles.colorBar}></Box>
            <Box>
                {campaignsLeadInfo?.status === "Delivered" ? (
                    <>
                        Sending to <span className={styles.count}>{count}</span> contact{count > 1 ? "s" : ""}
                    </>
                ) : (
                    <>
                        Sending to <span className={styles.count}>{count}</span> of{" "}
                        <span className={styles.count}>{campaignsLeadInfo?.totalCount}</span> contacts
                    </>
                )}
            </Box>
            <Box className={styles.divider} />
            <Box className={styles.filteredContent}>
                <span className={styles.status}>{campaignsLeadInfo?.status}</span>
                <span className={styles.italicText}> from</span>
                <span className={styles.campaignName}> {campaignsLeadInfo?.campaignName}</span>
            </Box>
            <Box className={styles.bannerFilter}>
                <ClearFilterButton onClear={onClickHandle} />
            </Box>
        </Box>
    );
}

export default CampaignsFilterBar;
