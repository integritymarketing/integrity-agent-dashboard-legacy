import React, { useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";
import NewBackBtn from "images/new-back-btn.svg";
import { Connect, Health, Policies, Overview } from "./Icons";
import { useLeadDetails } from "providers/ContactDetails";
import { ConnectModal } from "../ConnectModal";
import {toTitleCase} from "utils/toTitleCase";
import PlansTypeModal from "components/PlansTypeModal";

import styles from "./ContactProfileTabBar.module.scss";

const tabs = [
    { name: "Overview", section: "overview", icon: <Overview /> },
    { name: "Health Profile", section: "health", icon: <Health /> },
    { name: "Policies", section: "policies", icon: <Policies /> },
    { name: "Connect", section: "scope-of-appointment", icon: <Connect />, modalTrigger: true },
];

export const ContactProfileTabBar = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();
    const { leadDetails, selectedTab, setSelectedTab } = useLeadDetails();
    const location = useLocation();
    const currentPath = location.pathname;
    const [connectModalVisible, setConnectModalVisible] = useState(false);
    const [showPlanTypeModal, setShowPlanTypeModal] = useState(false);

    const isContactDetailsPage = currentPath?.toLowerCase().includes('contact');
    const leadName = leadDetails?.firstName && leadDetails?.lastName ? `${leadDetails?.firstName} ${leadDetails?.lastName}` : "Lead Name here ...";

    const handleSectionChange = useCallback(
        (section) => {
            setSelectedTab(section);
            navigate(`/newContact/${leadId}/${section}`);
        },
        [leadId, navigate, setSelectedTab]
    );

    const handleBackPage = useCallback(() => {
        if (location.state?.from) {
            navigate(-1);
        } else {
            navigate("/contacts");
        }
    }, [navigate, location.state]);

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
            <div className={`${styles.tabIcon} ${selectedTab === section ? styles.selected : ""}`}>{icon}</div>
            <div className={styles.tabName}>{name}</div>
        </Box>
    );

    return (
        <nav className={styles.contactProfileTabBar}>
            <div className={styles.backToContacts}>
                <Button
                    icon={<img src={NewBackBtn} alt="Back" />}
                    label="Back"
                    onClick={handleBackPage}
                    type="tertiary"
                    className={styles.backButton}
                />
            </div>

            <Box className={styles.profileMenu}>
                <h1 className={styles.userName}>{toTitleCase(leadName)}</h1>
                <div className={styles.profileTabs}>{tabs.map(renderTab)}</div>
                {isContactDetailsPage &&
                    <Button onClick={handleStartQuote} label="Start a Quote" type="primary" className={styles.quoteButton} />
                }
            </Box>
            {connectModalVisible && (
                <ConnectModal
                    open={connectModalVisible}
                    onClose={() => setConnectModalVisible(false)}
                    leadId={leadId}
                    leadDetails={leadDetails}
                />
            )}
            <PlansTypeModal showPlanTypeModal={showPlanTypeModal} handleModalClose={handleCloseShowPlanTypeModal} leadId={leadId} />
        </nav>
    );
};
