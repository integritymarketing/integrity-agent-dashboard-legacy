import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Media from "react-media";
import * as Sentry from "@sentry/react";

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
import useQueryParams from "hooks/useQueryParams";
import useFetch from "hooks/useFetch";

export const ContactDetailsContainer = () => {
    const { leadId, sectionId } = useParams();
    const params = useQueryParams();
    const tabSelectedInitial = params.get("tab");
    const isNewTextOpenInitial = params.get("isNewTextOpen");
    const { selectedTab, setSelectedTab, isLoadingLeadDetails, leadDetails, updateLeadDetailsWithZipCode } =
        useLeadDetails();
    const navigate = useNavigate();
    const [tabSelectedInitialState, setTabSelectedInitial] = useState(tabSelectedInitial);
    const [isNewTextOpen, setIsNewTextOpen] = useState(isNewTextOpenInitial);
    const [isMobile, setIsMobile] = useState(false);

    const zipCode = leadDetails?.addresses?.[0]?.postalCode;
    const URL = `${import.meta.env.VITE_QUOTE_URL}/api/v1.0/Search/GetCounties?zipcode=${zipCode}`;
    const { Get: getCounties } = useFetch(URL);

    useEffect(() => {
        if (tabSelectedInitial) {
            setTabSelectedInitial(tabSelectedInitial);
        }
        if (isNewTextOpenInitial) {
            setIsNewTextOpen(isNewTextOpenInitial);
        }
    }, [tabSelectedInitial, isNewTextOpenInitial]);

    useEffect(() => {
        const targetTab = sectionId || "overview";
        setSelectedTab(targetTab);
        navigate(`/contact/${leadId}/${targetTab}`, { replace: true });
    }, [sectionId, leadId, navigate, setSelectedTab]);

    useEffect(() => {
        const updateLeadDetails = async () => {
            try {
                const counties = await getCounties();
                if (counties?.length === 1) {
                    const payload = {
                        ...leadDetails,
                        addresses: [
                            {
                                ...leadDetails?.addresses?.[0],
                                county: counties[0]?.countyName,
                                countyFips: counties[0]?.countyFIPS,
                                stateCode: counties[0]?.state,
                            },
                        ],
                    };

                    await updateLeadDetailsWithZipCode(payload);
                }
            } catch (error) {
                Sentry.captureException(error);
            }
        };
        if (zipCode && !leadDetails?.addresses?.[0]?.county) {
            updateLeadDetails();
        }
    }, [getCounties, leadDetails, updateLeadDetailsWithZipCode, zipCode]);

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
                return (
                    <CommunicationsContainer
                        setTabSelectedInitial={setTabSelectedInitial}
                        tabSelectedInitialParam={tabSelectedInitialState}
                        isMobile={isMobile}
                        isNewTextOpen={isNewTextOpen}
                    />
                );
            default:
                return <OverviewContainer isMobile={isMobile} />;
        }
    };

    return (
        <>
            <Media
                query={"(max-width: 500px)"}
                onChange={(matches) => {
                    setIsMobile(matches);
                }}
            />
            <WithLoader isLoading={isLoadingLeadDetails}>
                {leadDetails && <ContactBodyContainer>{renderSection()}</ContactBodyContainer>}
                <SupportLinksCard />
            </WithLoader>
        </>
    );
};
