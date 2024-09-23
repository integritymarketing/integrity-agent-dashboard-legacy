import Box from "@mui/material/Box";

import useCampaignLeadIds from "../hooks/useCampaignLeadIds";
import ClearFilterButton from "components/CampaignInvitationContainer/InvitationCountBar/ClearFilterButton";

import { useContactsListContext } from "../providers/ContactsListProvider";
import styles from "./styles.module.scss";

function FilteredLeadIdsBanner() {
    const { refreshData } = useContactsListContext();
    const { filteredIds, removeFilteredLeadIds, filteredInfo } = useCampaignLeadIds();
    const count = filteredIds?.length ?? 0;

    const onClickHandle = () => {
        removeFilteredLeadIds();
        refreshData();
    };

    if (count === 0) {
        return <></>;
    }

    return (
        <Box className={styles.banner}>
            <Box className={styles.colorBar}></Box>
            <Box>
                {filteredInfo?.status === "Delivered" ? (
                    <>
                        Sending to <span className={styles.count}> {count}</span> contact{count > 1 && "s"}
                    </>
                ) : (
                    <>
                        Sending to <span className={styles.count}> {count}</span> of{" "}
                        <span className={styles.count}> {filteredInfo?.totalCount}</span> contacts
                    </>
                )}
            </Box>
            <Box className={styles.divider} />

            <Box className={styles.filteredContent}>
                <span className={styles.status}>{filteredInfo?.status}</span>
                <span className={styles.italicText}> from</span>
                <span className={styles.campaignName}> {filteredInfo?.campaignName}</span>
            </Box>

            <Box className={styles.bannerFilter}>
                <ClearFilterButton onClear={onClickHandle} />
            </Box>
        </Box>
    );
}

export default FilteredLeadIdsBanner;
