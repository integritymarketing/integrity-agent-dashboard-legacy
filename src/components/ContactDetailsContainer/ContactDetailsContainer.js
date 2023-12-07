import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { useLeadDetails } from "providers/ContactDetails";
import { OverviewContainer } from "./OverviewContainer";
import { PoliciesContainer } from "./PoliciesContainer";
import { HealthContainer } from "./HealthContainer";
import { ScopeOfAppointmentContainer } from "./ScopeOfAppointmentContainer";
import { OVERVIEW, POLICIES, HEALTH, SCOPE_OF_APPOINTMENT, VIEW_SCOPE_OF_APPOINTMENT, COMPLETE_SCOPE_OF_APPOINTMENT } from "./tabNames";
import WithLoader from "components/ui/WithLoader";
import { SOAConfirmationForm } from "./ScopeOfAppointmentContainer/SOAConfirmationForm/SOAConfirmationForm";
import { SOAViewForm } from "./ScopeOfAppointmentContainer/SOAViewForm/SOAViewForm";
import styles from "./ContactDetailsContainer.module.scss";
import SupportLinksCard from "components/SupportLinksCard";

export const ContactDetailsContainer = () => {
    const { leadId, section } = useParams();
    const { selectedTab, getLeadDetails, setSelectedTab, isLoadingLeadDetails } = useLeadDetails();

    useEffect(() => {
        getLeadDetails(leadId);
    }, [leadId]);

    useEffect(() => {
        setSelectedTab(section);
    }, [section]);

    const renderSection = () => {
        switch (selectedTab) {
            case OVERVIEW:
                return <OverviewContainer />;
            case POLICIES:
                return <PoliciesContainer />;
            case HEALTH:
                return <HealthContainer />;
            case SCOPE_OF_APPOINTMENT:
                return <ScopeOfAppointmentContainer />;
            case VIEW_SCOPE_OF_APPOINTMENT:
                return <SOAViewForm />;
            case COMPLETE_SCOPE_OF_APPOINTMENT:
                return <SOAConfirmationForm />;
            default:
                return <OverviewContainer />;
        }
    };

    return (
        <>
            <WithLoader isLoading={isLoadingLeadDetails}>
                <Box className={styles.ContactDetailsContainer}>{renderSection()}</Box>
                <SupportLinksCard />
            </WithLoader>
        </>
    );
};
