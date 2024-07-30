import { useCallback, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";

import { useLeadDetails } from "providers/ContactDetails";

import { toTitleCase } from "utils/toTitleCase";

import PlansTypeModal from "components/PlansTypeModal";
import BackButton from "components/BackButton";
import { Button } from "components/ui/Button";
import Container from "components/ui/container";

import styles from "./ContactProfileTabBar.module.scss";
import { Connect, Health, Overview, Policies } from "./Icons";

import { ConnectModal } from "../ConnectModal";

import ArrowForwardWithCircle from "components/icons/version-2/ArrowForwardWithCirlce";
import { useMediaQuery, useTheme } from "@mui/material";

const tabs = [
    { name: "Overview", section: "overview", icon: <Overview /> },
    { name: "Health Profile", section: "health", icon: <Health /> },
    { name: "Policies", section: "policies", icon: <Policies /> },
    { name: "Connect", section: "communications", icon: <Connect />, modalTrigger: false },
];

export const ContactProfileTabBar = ({ contactId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { leadId: leadIdParam } = useParams();
    const leadId = contactId || leadIdParam;
    const navigate = useNavigate();
    const { leadDetails, selectedTab, setSelectedTab } = useLeadDetails();
    const location = useLocation();
    const currentPath = location.pathname;
    const [connectModalVisible, setConnectModalVisible] = useState(false);
    const [showPlanTypeModal, setShowPlanTypeModal] = useState(false);

    const isContactDetailsPage = currentPath?.toLowerCase().includes("contact");
    const leadName =
        leadDetails?.firstName && leadDetails?.lastName && leadId == leadDetails?.leadsId
            ? [leadDetails?.firstName, leadDetails?.middleName, leadDetails?.lastName].filter(Boolean).join(" ")
            : "";
    const zipcode = leadDetails?.addresses && leadDetails?.addresses[0]?.postalCode;

    const handleSectionChange = useCallback(
        (section) => {
            setSelectedTab(section);
            navigate(`/contact/${leadId}/${section}`);
        },
        [leadId, navigate, setSelectedTab],
    );

    const handleCloseShowPlanTypeModal = useCallback(() => {
        setShowPlanTypeModal(false);
    }, []);

    const handleStartQuote = useCallback(() => {
        setShowPlanTypeModal(true);
    }, []);

    const renderTab = ({ name, section, icon, modalTrigger }) => (
        <Box
            key={section}
            className={styles.profileTab}
            onClick={() => (modalTrigger ? setConnectModalVisible(true) : handleSectionChange(section))}
        >
            <Box className={`${styles.tabIcon} ${selectedTab === section ? styles.selected : ""}`}>{icon}</Box>
            <Box className={styles.tabName}>{name}</Box>
        </Box>
    );

    return (
        <Box className={styles.navWrapper}>
            <Container className={styles.contactProfileTabBar}>
                <Box className={styles.backToContacts}>
                    <BackButton />
                </Box>
                <Box className={styles.profileMenu}>
                    <Box className={styles.userName}>{toTitleCase(leadName)}</Box>
                    <Box className={styles.profileTabs}>{tabs.map(renderTab)}</Box>
                    {isContactDetailsPage && (
                        <Button
                            onClick={handleStartQuote}
                            label="Start a Quote"
                            type="primary"
                            className={styles.quoteButton}
                        />
                    )}
                </Box>

                <Box className={styles.contactButton}>
                    <Button
                        onClick={() => setConnectModalVisible(true)}
                        label="Contact"
                        icon={<ArrowForwardWithCircle />}
                        iconPosition="right"
                        type="primary"
                        className={styles.quoteButton}
                    />
                </Box>

                {connectModalVisible && (
                    <ConnectModal
                        isOpen={connectModalVisible}
                        onClose={() => setConnectModalVisible(false)}
                        leadId={leadId}
                        leadDetails={leadDetails}
                    />
                )}
                <PlansTypeModal
                    zipcode={zipcode}
                    showPlanTypeModal={showPlanTypeModal}
                    handleModalClose={handleCloseShowPlanTypeModal}
                    leadId={leadId}
                />
            </Container>
        </Box>
    );
};
