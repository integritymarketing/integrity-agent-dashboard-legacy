import { useCallback, useEffect, useState } from "react";
import Media from "react-media";
import { useNavigate, useParams } from "react-router-dom";

import { useLeadDetails } from "providers/ContactDetails";
import { useScopeOfAppointment } from "providers/ContactDetails/ContactDetailsContext";

import useAnalytics from "hooks/useAnalytics";

import WithLoader from "components/ui/WithLoader";

import SOAModal from "pages/contacts/contactRecordInfo/soaList/SOAModal";

import { Share } from "./Icons";
import { SOAContainer } from "./SOAContainer/SOAContainer";
import { SOASent } from "./SOASent/SOASent";
import { SOASignedComplete } from "./SOASignedComplete/SOASignedComplete";
import { SOASignedView } from "./SOASignedView/SOASignedView";
import { SCOPES_OF_APPOINTMENT, SEND_NEW } from "./ScopeOfAppointmentContainer.constants";
import styles from "./ScopeOfAppointmentContainer.module.scss";

import { COMPLETE_SCOPE_OF_APPOINTMENT, VIEW_SCOPE_OF_APPOINTMENT } from "../tabNames";

export const ScopeOfAppointmentContainer = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();
    const { setSelectedTab, leadDetails } = useLeadDetails();
    const [isMobile, setIsMobile] = useState(false);
    const [openSOAModal, setOpenSOAModal] = useState(false);
    const { getSoaList, soaList = [], isSoaListLoading, setLinkCode } = useScopeOfAppointment();

    const { leadsId, leadTags, statusName, plan_enroll_profile_created } = leadDetails;

    useEffect(() => {
        fireEvent("Contact SOA Page Viewed", {
            leadid: leadId,
            selection: "start_quote",
            tags: leadTags,
            stage: statusName,
            plan_enroll_profile_created: plan_enroll_profile_created,
        });
    }, []);

    useEffect(() => {
        if (!leadId) {
            return;
        }
        getSoaList(leadId);
    }, [getSoaList, leadId]);

    const handleComplete = useCallback(
        (linkCode) => {
            setLinkCode(linkCode);
            setSelectedTab(COMPLETE_SCOPE_OF_APPOINTMENT);
            navigate(`/contact/${leadId}/${COMPLETE_SCOPE_OF_APPOINTMENT}`);
        },
        [leadId, navigate, setLinkCode, setSelectedTab]
    );

    const handleView = useCallback(
        (linkCode) => {
            setLinkCode(linkCode);
            setSelectedTab(VIEW_SCOPE_OF_APPOINTMENT);
            navigate(`/contact/${leadId}/${VIEW_SCOPE_OF_APPOINTMENT}`);
        },
        [leadId, navigate, setLinkCode, setSelectedTab]
    );

    const renderSOACard = (soa) => {
        switch (soa.status) {
            case "Signed":
                return <SOASignedComplete onComplete={handleComplete} soa={soa} />;
            case "Sent":
                return <SOASent soa={soa} />;
            case "Completed":
                return <SOASignedView onView={handleView} soa={soa} />;
            default:
                return <SOASent soa={soa} />;
        }
    };

    const renderScopeOfAppointments = () => (
        <>
            <div className={`${isMobile ? styles.columnView : ""} ${styles.soaTitleHeader}`}>
                <div className={styles.titleWrapper}>
                    <div className={styles.soaTitle}>{SCOPES_OF_APPOINTMENT}</div>
                </div>
                <div className={styles.sendNewWrapper} onClick={() => setOpenSOAModal(true)}>
                    <div className={styles.sendStyle}>{SEND_NEW}</div>
                    <Share className={styles.infoStyle} />
                </div>
            </div>
            {soaList && soaList?.length > 0 ? (
                soaList?.map((soa, index) => {
                    return <div key={`SOA_LIST-${index}`}>{renderSOACard(soa)}</div>;
                })
            ) : (
                <div className={styles.noSOA}>
                    <div className={styles.noSOAText}>This contact has no Scope Of Appointments.</div>
                    <div className={styles.titleWrapper} onClick={() => setOpenSOAModal(true)}>
                        <div className={styles.sendStyle}>{SEND_NEW}</div>
                        <Share className={styles.infoStyle} />
                    </div>
                </div>
            )}
        </>
    );

    return (
        <WithLoader isLoading={isSoaListLoading}>
            <Media
                query={"(max-width: 540px)"}
                onChange={() => {
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
    );
};
