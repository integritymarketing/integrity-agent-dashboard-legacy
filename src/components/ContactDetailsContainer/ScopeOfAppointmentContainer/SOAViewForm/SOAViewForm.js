import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductSelection } from '../ProductSelection/ProductSelection';
import { SOAContactDetails } from '../SOAContactDetails/SOAContactDetails';
import { SOAFormDetails } from '../SOAFormDetails/SOAFormDetails';
import { SOA_CONFIRMATION_FORM, SOA_CONSENT, SOA_SCOPE } from '../ScopeOfAppointmentContainer.constants';
import { useScopeOfAppointment } from 'providers/ContactDetails/ContactDetailsContext';
import { SOAContainer } from '../SOAContainer/SOAContainer';

import styles from './SOAViewForm.module.scss';

export const SOAViewForm = () => {
    const { leadId } = useParams();

    const { getSoaByLinkCode, soaByLinkcode, linkCode } = useScopeOfAppointment();

    const [soaDetails, setSoaDetails] = useState(null);
    const [leadSection, setLeadSection] = useState(null);
    const [agentSection, setAgentSection] = useState(null);




    useEffect(() => {
        if (!linkCode || !leadId) return;
        getSoaByLinkCode(leadId, linkCode)
    }
        , [getSoaByLinkCode, linkCode, leadId])


    useEffect(() => {
        if (!soaByLinkcode) return;
        setSoaDetails(soaByLinkcode)
        setLeadSection(soaByLinkcode?.leadSection);
        setAgentSection(soaByLinkcode?.agentSection);
    }
        , [soaByLinkcode])



    const renderConsentText = () => {
        return SOA_CONSENT.split('\n').map((text, index) => (
            <React.Fragment key={index}>
                <p>{text}</p>
                {index < SOA_CONSENT.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return (
        <SOAContainer>
            {soaDetails &&
                <>
                    <div className={styles.soaTitleHeader}>{SOA_CONFIRMATION_FORM}</div>
                    <div className={styles.formWrapper}>
                        <div>{SOA_SCOPE}</div>
                        {leadSection && <ProductSelection listOfProducts={leadSection?.products || []} />}
                        <div>{renderConsentText()}</div>
                        {leadSection && <SOAContactDetails leadSection={leadSection} />}
                        {agentSection && <SOAFormDetails agentSection={agentSection} linkCode={linkCode} />}
                    </div>
                </>
            }
        </SOAContainer>
    );
};

