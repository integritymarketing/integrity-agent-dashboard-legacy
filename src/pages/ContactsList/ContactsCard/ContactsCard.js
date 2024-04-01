import { useState } from "react";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";

import { CardHeader } from "./CardHeader";
import { CardStage } from "./CardStage";
import styles from "./styles.module.scss";
import ReminderModals from "../RemiderModals/ReminderModals";
import { useWindowSize } from "hooks/useWindowSize";
import { isOverDue } from "utils/dates";

import { LoadMoreButton } from "../LoadMoreButton";
import { useContactsListContext } from "../providers/ContactsListProvider";
import { Reminder } from "components/icons/version-2/Reminder";
import CardBadge from "./CardBadge/CardBadge";
import LifeIcon from "./LifeIcon";
import HealthIcon from "./HealthIcon";
import CampaignStatus from "components/icons/version-2/CampaignStatus";
import AskIntegrity from "components/icons/version-2/AskIntegrity";
import Connectemail from "components/icons/version-2/ConnectEmail";
import AskIntegrityModal from "pages/ContactsList/AskIntegrityModal/AskIntegrityModal";
import CampaignModal from "pages/ContactsList/CampaignModal/CampaignModal";

function ContactsCard() {
    const { tableData } = useContactsListContext();
    const { width: windowWidth } = useWindowSize();

    const [showRemindersListModal, setShowRemindersListModal] = useState(false);
    const [showAddReminderModal, setShowAddReminderModal] = useState(false);
    const [showAskIntegrityModal, setShowAskIntegrityModal] = useState(false);
    const [askIntegrityList, setAskIntegrityList] = useState(false);
    const [campaignList, setCampaignList] = useState(false);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const isMobile = windowWidth <= 784;
    const [leadData, setLeadData] = useState({});

    const RemindersHandler = (remindersLength, leadData) => {
        setLeadData(leadData);
        if (!remindersLength) {
            setShowAddReminderModal(true);
        } else {
            setShowRemindersListModal(true);
        }
    };

    const askIntegrityHandler = (askIntegrityTags, leadData) => {
        setLeadData(leadData);
        setAskIntegrityList(askIntegrityTags);
        setShowAskIntegrityModal(true);
    };

    const campaignTagsHandler = (campaignTags, leadData) => {
        setLeadData(leadData);
        setCampaignList(campaignTags);
        setShowCampaignModal(true);
    };

    const checkOverDue = (reminders) => {
        if (!reminders) return false;
        const overDue = reminders.filter((reminder) => {
            const { reminderDate } = reminder;
            return isOverDue(reminderDate);
        });
        return overDue?.length > 0 ? true : false;
    };
    return (
        <Box className={styles.container}>
            <Box className={styles.cardWrapper}>
                {tableData.map((item) => {
                    const { lifePolicyCount, healthPolicyCount, reminders } = item;
                    const remindersLength = reminders?.length;
                    const isOverDue = checkOverDue(reminders) ? true : false;
                    const askIntegrityTags = item?.leadTags?.filter(
                        (tag) => tag?.tag?.tagCategory?.tagCategoryName === "Ask Integrity Recommendations"
                    );
                    const campaignTags = item?.leadTags?.filter(
                        (tag) => tag?.tag?.tagCategory?.tagCategoryName === "Campaigns"
                    );
                    return (
                        <Box key={item?.leadsId} className={styles.card}>
                            <CardHeader item={item} />
                            <Divider />
                            <Box className={styles.innerWrapper}>
                                <CardStage item={item} />
                                <CardBadge
                                    label="Reminders"
                                    Icon={
                                        <Box
                                            sx={{ cursor: "pointer" }}
                                            onClick={() => RemindersHandler(remindersLength, item)}
                                        >
                                            <Reminder color={isOverDue ? "#F44236" : "#4178FF"} />
                                        </Box>
                                    }
                                />
                                <CardBadge label="Connect" Icon={<Connectemail />} />
                            </Box>

                            <Box className={styles.innerWrapper}>
                                {/* {campaignTags?.length > 0 && ( */}
                                <CardBadge
                                    label="Campaign"
                                    Icon={
                                        <Box
                                            sx={{ cursor: "pointer" }}
                                            onClick={() => campaignTagsHandler(campaignTags, item)}
                                        >
                                            <CampaignStatus />
                                        </Box>
                                    }
                                />
                                {/* )} */}
                                {askIntegrityTags?.length > 0 && (
                                    <CardBadge
                                        label="Ask Integrity"
                                        Icon={
                                            <Box
                                                sx={{ cursor: "pointer" }}
                                                onClick={() => askIntegrityHandler(askIntegrityTags, item)}
                                            >
                                                <AskIntegrity />
                                            </Box>
                                        }
                                    />
                                )}
                                <CardBadge label="Life" Icon={<LifeIcon lifePolicyCount={lifePolicyCount} />} />
                                <CardBadge label="Health" Icon={<HealthIcon healthPolicyCount={healthPolicyCount} />} />
                            </Box>
                        </Box>
                    );
                })}
            </Box>
            <LoadMoreButton />
            <ReminderModals
                leadData={leadData}
                isMobile={isMobile}
                showAddReminderModal={showAddReminderModal}
                setShowAddReminderModal={setShowAddReminderModal}
                showRemindersListModal={showRemindersListModal}
                setShowRemindersListModal={setShowRemindersListModal}
            />
            {showAskIntegrityModal && (
                <AskIntegrityModal
                    open={showAskIntegrityModal}
                    onClose={() => setShowAskIntegrityModal(false)}
                    leadData={leadData}
                    askIntegrityList={askIntegrityList}
                />
            )}
            {showCampaignModal && (
                <CampaignModal
                    open={showCampaignModal}
                    onClose={() => setShowCampaignModal(false)}
                    leadData={leadData}
                    campaignList={campaignList}
                />
            )}
        </Box>
    );
}

export default ContactsCard;
