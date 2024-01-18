import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";

import { useLeadDetails } from "providers/ContactDetails";

import SupportLinksCard from "components/SupportLinksCard";
import WithLoader from "components/ui/WithLoader";

import styles from "./ContactDetailsContainer.module.scss";
import { HealthContainer } from "./HealthContainer";
import { OverviewContainer } from "./OverviewContainer";
import { PoliciesContainer } from "./PoliciesContainer";
import { ScopeOfAppointmentContainer } from "./ScopeOfAppointmentContainer";
import { SOAConfirmationForm } from "./ScopeOfAppointmentContainer/SOAConfirmationForm/SOAConfirmationForm";
import { SOAViewForm } from "./ScopeOfAppointmentContainer/SOAViewForm/SOAViewForm";
import {
    COMPLETE_SCOPE_OF_APPOINTMENT,
    HEALTH,
    OVERVIEW,
    POLICIES,
    SCOPE_OF_APPOINTMENT,
    VIEW_SCOPE_OF_APPOINTMENT,
} from "./tabNames";

export const ContactDetailsContainer = () => {
    const { leadId, sectionId } = useParams();
    const { selectedTab, setSelectedTab, isLoadingLeadDetails, leadDetails } = useLeadDetails();
    const navigate = useNavigate();

    useEffect(() => {
        const targetTab = sectionId || "overview";
        setSelectedTab(targetTab);
        navigate(`/contact/${leadId}/${targetTab}`, { replace: true });
    }, [sectionId, leadId, navigate, setSelectedTab]);

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
                {leadDetails && <Box className={styles.ContactDetailsContainer}>{renderSection()}</Box>}
                <SupportLinksCard />
            </WithLoader>
        </>
    );
};
