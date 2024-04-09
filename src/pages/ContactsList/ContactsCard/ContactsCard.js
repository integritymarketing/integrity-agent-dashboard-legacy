import { useState } from "react";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";

import { CardHeader } from "./CardHeader";
import { CardStage } from "./CardStage";
import styles from "./styles.module.scss";
import ReminderModals from "../RemiderModals/ReminderModals";
import { useWindowSize } from "hooks/useWindowSize";
import { isOverDue, sortListByDate } from "utils/dates";

import { LoadMoreButton } from "../LoadMoreButton";
import { useContactsListContext } from "../providers/ContactsListProvider";
import { Reminder } from "components/icons/version-2/Reminder";
import CardBadge from "./CardBadge/CardBadge";
import CampaignStatus from "components/icons/version-2/CampaignStatus";
import AskIntegrity from "components/icons/version-2/AskIntegrity";
import AskIntegrityModal from "pages/ContactsList/AskIntegrityModal/AskIntegrityModal";
import CampaignModal from "pages/ContactsList/CampaignModal/CampaignModal";
import ConnectCall from "../ConnectCall";
import ConnectEmail from "../ConnectEmail";
import BadgeIcon from "./BadgeIcon";

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

    const remindersHandler = (remindersLength, leadData) => {
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
                    const {
                        lifePolicyCount,
                        healthPolicyCount,
                        reminders,
                        firstName,
                        lastName,
                        leadsId,
                        primaryCommunication,
                    } = item;
                    const remindersList = reminders?.filter((reminder) => !reminder?.isComplete);
                    const remindersLength = remindersList?.length;
                    const isOverDue = checkOverDue(remindersList) ? true : false;
                    const askIntegrityTags = item?.leadTags?.filter(
                        (tag) => tag?.tag?.tagCategory?.tagCategoryName === "Ask Integrity Recommendations"
                    );
                    const campaignTags = item?.leadTags?.filter(
                        (tag) => tag?.tag?.tagCategory?.tagCategoryName === "Campaigns"
                    );
                    const isPhoneConnect = primaryCommunication === "phone";
                    const leadData = { firstName, lastName, leadsId };
                    return (
                        <Box key={item?.leadsId} className={styles.card}>
                            <CardHeader item={item} />
                            <Divider />
                            <Box className={styles.innerWrapper}>
                                <CardStage item={item} />
                                <CardBadge
                                    label="Reminders"
                                    name={"reminder"}
                                    onClick={() => remindersHandler(remindersLength, item)}
                                    Icon={
                                        <Box sx={{ cursor: "pointer" }}>
                                            <Reminder
                                                color={
                                                    remindersLength > 0
                                                        ? isOverDue
                                                            ? "#F44236"
                                                            : "#4178FF"
                                                        : "#717171"
                                                }
                                            />
                                        </Box>
                                    }
                                    count={remindersLength > 1 ? remindersLength : null}
                                />
                                <CardBadge
                                    label="Connect"
                                    Icon={
                                        isPhoneConnect ? (
                                            <ConnectCall row={item} />
                                        ) : (
                                            <ConnectEmail emails={item.emails} />
                                        )
                                    }
                                />
                            </Box>

                            <Box className={styles.innerWrapper}>
                                {campaignTags?.length > 0 && (
                                    <CardBadge
                                        label="Campaign"
                                        name={"campaign"}
                                        onClick={() => campaignTagsHandler(campaignTags, item)}
                                        Icon={
                                            <Box sx={{ cursor: "pointer" }}>
                                                <CampaignStatus />
                                            </Box>
                                        }
                                        count={campaignTags?.length > 1 ? campaignTags?.length : null}
                                    />
                                )}
                                {askIntegrityTags?.length > 0 && (
                                    <CardBadge
                                        label="Ask Integrity"
                                        name="askIntegrity"
                                        onClick={() => askIntegrityHandler(askIntegrityTags, item)}
                                        Icon={
                                            <Box sx={{ cursor: "pointer" }}>
                                                <AskIntegrity />
                                            </Box>
                                        }
                                        count={askIntegrityTags?.length > 1 ? askIntegrityTags?.length : null}
                                    />
                                )}
                                <CardBadge
                                    label="Life"
                                    count={lifePolicyCount}
                                    Icon={
                                        <BadgeIcon count={lifePolicyCount} leadData={{ ...leadData, policy: "LIFE" }} />
                                    }
                                />
                                <CardBadge
                                    label="Health"
                                    count={healthPolicyCount}
                                    Icon={
                                        <BadgeIcon
                                            count={healthPolicyCount}
                                            leadData={{ ...leadData, policy: "HEALTH" }}
                                        />
                                    }
                                />
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
