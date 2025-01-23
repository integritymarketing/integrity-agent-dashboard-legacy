import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { MedicareDocumentation } from "../MedicareDocumentation/MedicareDocumentation";
import { ProductSelection } from "../ProductSelection/ProductSelection";
import { SOAContactDetailsForm } from "../SOAContactDetailsForm/SOAContactDetailsForm";
import { SOA_CONFIRMATION_FORM, SOA_CONSENT, SOA_SCOPE } from "../ScopeOfAppointmentContainer.constants";
import { SOAContactDetails } from "../SOAContactDetails/SOAContactDetails";
import { useScopeOfAppointment } from "providers/ContactDetails/ContactDetailsContext";
import { useLeadDetails } from "providers/ContactDetails";
import { SOAContainer } from "../SOAContainer/SOAContainer";
import { VIEW_SCOPE_OF_APPOINTMENT } from "../../tabNames";
import styles from "./SOAConfirmationForm.module.scss";

export const SOAConfirmationForm = () => {
    const { leadId } = useParams();
    const { setSelectedTab } = useLeadDetails();
    const { getSoaByLinkCode, soaByLinkcode, updateSoaByLinkCode, linkCode } = useScopeOfAppointment();

    const [soaDetails, setSoaDetails] = useState(null);
    const [leadSection, setLeadSection] = useState(null);
    const [agentSection, setAgentSection] = useState(null);

    const handleView = useCallback(() => {
        setSelectedTab(VIEW_SCOPE_OF_APPOINTMENT);
    }, [setSelectedTab]);

    useEffect(() => {
        if (!linkCode || !leadId) return;
        getSoaByLinkCode(leadId, linkCode);
    }, [getSoaByLinkCode, linkCode, leadId]);

    useEffect(() => {
        if (!soaByLinkcode) return;
        setSoaDetails(soaByLinkcode);
        setLeadSection(soaByLinkcode?.leadSection);
        setAgentSection(soaByLinkcode?.agentSection);
    }, [soaByLinkcode]);

    const handleSubmit = (data) => {
        const payload = {
            ...soaDetails,
            agentSection: {
                ...soaDetails.agentSection,
                ...data,
                soaSignedDuringAppointment: data.soaSignedDuringAppointment === "Yes",
            },
        };
        updateSoaByLinkCode(payload, linkCode, handleView);
        // handleView();
    };

    const renderConsentText = () => {
        return SOA_CONSENT.split("\n").map((text, index) => (
            <React.Fragment key={index}>
                <p>{text}</p>
                {index < SOA_CONSENT.split("\n").length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return (
        <SOAContainer>
            <div className={styles.soaTitleHeader}>{SOA_CONFIRMATION_FORM}</div>
            <div className={styles.formWrapper}>
                <div>{SOA_SCOPE}</div>
                {leadSection && <ProductSelection listOfProducts={leadSection?.products || []} />}
                <div>{renderConsentText()}</div>
                {leadSection && <SOAContactDetails leadSection={leadSection} />}
                <SOAContactDetailsForm onSubmit={handleSubmit} agentSection={agentSection} />
                <MedicareDocumentation />
            </div>
        </SOAContainer>
    );
};

SOAConfirmationForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};
