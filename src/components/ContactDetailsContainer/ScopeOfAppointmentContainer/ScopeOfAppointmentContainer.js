import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SCOPES_OF_APPOINTMENT, SEND_NEW } from './ScopeOfAppointmentContainer.constants';
import { VIEW_SCOPE_OF_APPOINTMENT, COMPLETE_SCOPE_OF_APPOINTMENT } from "../tabNames";
import { SOASignedComplete } from './SOASignedComplete/SOASignedComplete';
import { SOASent } from './SOASent/SOASent';
import { SOASignedView } from './SOASignedView/SOASignedView';
import { SOAContainer } from './SOAContainer/SOAContainer';
import Media from 'react-media';
import { Info, Share } from "./Icons";
import { useScopeOfAppointment } from 'providers/ContactDetails/ContactDetailsContext';
import WithLoader from "components/ui/WithLoader";
import { useLeadDetails } from "providers/ContactDetails";
import SOAModal from "pages/contacts/contactRecordInfo/soaList/SOAModal";

import styles from './ScopeOfAppointmentContainer.module.scss';


export const ScopeOfAppointmentContainer = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();
    const { setSelectedTab } = useLeadDetails();
    const [isMobile, setIsMobile] = useState(false);
    const [openSOAModal, setOpenSOAModal] = useState(false);
    const { getSoaList, soaList = [], isSoaListLoading, setLinkCode } = useScopeOfAppointment();

    useEffect(() => {
        if (!leadId) return;
        getSoaList(leadId)
    }, [getSoaList, leadId])


    const handleComplete = useCallback((linkCode) => {
        setLinkCode(linkCode);
        setSelectedTab(COMPLETE_SCOPE_OF_APPOINTMENT);
        navigate(`/newContact/${leadId}/${COMPLETE_SCOPE_OF_APPOINTMENT}`);
    }, [setLinkCode, setSelectedTab]);



    const handleView = useCallback((linkCode) => {
        setLinkCode(linkCode);
        setSelectedTab(VIEW_SCOPE_OF_APPOINTMENT);
        navigate(`/newContact/${leadId}/${VIEW_SCOPE_OF_APPOINTMENT}`);
    }, [setLinkCode, setSelectedTab]);

    const renderSOACard = (soa) => {
        switch (soa.status) {
            case 'Signed':
                return <SOASignedComplete onComplete={handleComplete} soa={soa} />
            case 'Sent':
                return <SOASent soa={soa} />
            case 'Completed':
                return <SOASignedView onView={handleView} soa={soa} />
            default:
                return <SOASent soa={soa} />
        }
    };

    const renderScopeOfAppointments = () => (
        <>
            <div className={`${isMobile ? styles.columnView : ""} ${styles.soaTitleHeader}`}>
                <div className={styles.titleWrapper}>
                    <div className={styles.soaTitle}>{SCOPES_OF_APPOINTMENT}</div>
                    <Info className={styles.infoStyle} />
                </div>
                <div className={styles.titleWrapper} onClick={() => setOpenSOAModal(true)}>
                    <div className={styles.sendStyle} >{SEND_NEW}</div>
                    <Share className={styles.infoStyle} />
                </div>
            </div>
            {soaList && soaList?.length > 0 ? soaList?.map((soa, index) => {
                return (
                    <div key={`SOA_LIST-${index}`}>
                        {renderSOACard(soa)}
                    </div>
                )
            }) :

                <div className={styles.noSOA}>
                    <div className={styles.noSOAText} >This contact has no Scope Of Appointments.</div>
                    <div className={styles.titleWrapper} onClick={() => setOpenSOAModal(true)}>
                        <div className={styles.sendStyle} >{SEND_NEW}</div>
                        <Share className={styles.infoStyle} />
                    </div>

                </div>
            }

        </>
    );


    return (

        <WithLoader isLoading={isSoaListLoading}>
            <Media
                query={"(max-width: 540px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <SOAContainer>{renderScopeOfAppointments()} </SOAContainer>

            <SOAModal
                id={leadId}
                openSOAModal={openSOAModal}
                setOpenSOAModal={setOpenSOAModal}
                refreshSOAList={getSoaList}
            />
        </WithLoader>
    )

};