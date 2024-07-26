import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Media from "react-media";

import { useLeadDetails } from "providers/ContactDetails";

import SupportLinksCard from "components/SupportLinksCard";
import WithLoader from "components/ui/WithLoader";

import { HealthContainer } from "./HealthContainer";
import { OverviewContainer } from "./OverviewContainer";
import { PoliciesContainer } from "./PoliciesContainer";
import { ScopeOfAppointmentContainer } from "./ScopeOfAppointmentContainer";
import { SOAConfirmationForm } from "./ScopeOfAppointmentContainer/SOAConfirmationForm/SOAConfirmationForm";
import { SOAViewForm } from "./ScopeOfAppointmentContainer/SOAViewForm/SOAViewForm";
import {
    COMMUNICATIONS_CONTAINER,
    COMPLETE_SCOPE_OF_APPOINTMENT,
    HEALTH,
    OVERVIEW,
    POLICIES,
    SCOPE_OF_APPOINTMENT,
    VIEW_SCOPE_OF_APPOINTMENT,
} from "./tabNames";
import { ContactBodyContainer } from "./ContactBodyContainer/ContactBodyContainer";
import CommunicationsContainer from "./CommunicationsContainer";

export const ContactDetailsContainer = () => {
    const { leadId, sectionId } = useParams();
    const { selectedTab, setSelectedTab, isLoadingLeadDetails, leadDetails } = useLeadDetails();
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const targetTab = sectionId || "overview";
        setSelectedTab(targetTab);
        navigate(`/contact/${leadId}/${targetTab}`, { replace: true });
    }, [sectionId, leadId, navigate, setSelectedTab]);

    const renderSection = () => {
        switch (selectedTab) {
            case OVERVIEW:
                return <OverviewContainer isMobile={isMobile} />;
            case POLICIES:
                return <PoliciesContainer isMobile={isMobile} />;
            case HEALTH:
                return <HealthContainer isMobile={isMobile} />;
            case SCOPE_OF_APPOINTMENT:
                return <ScopeOfAppointmentContainer isMobile={isMobile} />;
            case VIEW_SCOPE_OF_APPOINTMENT:
                return <SOAViewForm isMobile={isMobile} />;
            case COMPLETE_SCOPE_OF_APPOINTMENT:
                return <SOAConfirmationForm isMobile={isMobile} />;
            case COMMUNICATIONS_CONTAINER:
                return <CommunicationsContainer isMobile={isMobile} />;
            default:
                return <OverviewContainer isMobile={isMobile} />;
        }
    };

    return (
        <>
            <Media
                query={"(max-width: 500px)"}
                onChange={() => {
                    setIsMobile(isMobile);
                }}
            />
            <WithLoader isLoading={isLoadingLeadDetails}>
                {leadDetails && <ContactBodyContainer>{renderSection()}</ContactBodyContainer>}
                <SupportLinksCard />
            </WithLoader>
        </>
    );
};
