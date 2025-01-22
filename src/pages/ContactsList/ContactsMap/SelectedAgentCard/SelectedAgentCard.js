import { Button } from "components/ui/Button";
import styles from "./styles.module.scss";
import { Avatar, Divider, Grid, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import useToast from "hooks/useToast";
import useAnalytics from "hooks/useAnalytics";
import { useCallback, useMemo, useState } from "react";
import { StageCell } from "pages/ContactsList/ContactsTable/StageCell";
import Connectemail from "components/icons/version-2/ConnectEmail";
import { ConnectPhone } from "components/icons/version-2/ConnectPhone";
import { CampaignTypeTextMessage, LocationPin } from "@integritymarketing/icons";
import { formatPhoneNumber } from "utils/phones";
import useFetch from "hooks/useFetch";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import { CallScriptModal } from "packages/CallScriptModal";
import BackButton from "components/BackButton";
import PropTypes from "prop-types";
import { formatAddress } from "utils/addressFormatter";
import { formatFullName } from "utils/formatFullName";

const NOT_AVAILABLE = "N/A";

function SelectedAgentCard({ selectedAgent, setSelectedAgent }) {
    const showToast = useToast();
    const { fireEvent } = useAnalytics();
    const { agentInformation } = useAgentInformationByID();
    const { agentID, callForwardNumber, agentVirtualPhoneNumber, agentNPN } = agentInformation || {};
    const formattedPhoneNumber = agentVirtualPhoneNumber?.replace(/^\+1/, "");
    const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
    const {
        firstName,
        lastName,
        addresses,
        phones,
        emails,
        leadsId,
        statusName,
        leadTags,
        plan_enroll_profile_created,
    } = selectedAgent;

    const { Post: outboundCallFromMedicareCenter } = useFetch(
        `${import.meta.env.VITE_COMMUNICATION_API}/Call/CallCustomer`
    );

    const phone = useMemo(() => {
        return phones[0]?.leadPhone;
    }, [phones]);

    const handleCall = useCallback(async () => {
        if (phone !== NOT_AVAILABLE) {
            const payload = {
                agentId: agentID,
                leadId: leadsId,
                agentTwilioNumber: formattedPhoneNumber,
                agentPhoneNumber: callForwardNumber,
                customerNumber: phone,
                agentNPN,
            };
            try {
                await outboundCallFromMedicareCenter(payload);
                showToast({
                    type: "success",
                    message: "Call Initiated Successfully",
                });
                setIsScriptModalOpen(true);
                fireEvent("Outbound Call", {
                    leadid: leadsId,
                    tags: leadTags,
                    stage: statusName,
                    plan_enroll_profile_created,
                });
            } catch (error) {
                showToast({
                    type: "error",
                    message: "Error initiating call. Please try again.",
                });
            }
        }
    }, [
        agentID,
        callForwardNumber,
        formattedPhoneNumber,
        agentNPN,
        leadsId,
        phone,
        outboundCallFromMedicareCenter,
        showToast,
        setIsScriptModalOpen,
        fireEvent,
        leadTags,
        statusName,
        plan_enroll_profile_created,
    ]);

    const address = useMemo(() => {
        const addressFirst = addresses[0];
        const { address1, address2, postalCode, stateCode } = addressFirst;
        return formatAddress({ address1, address2, postalCode, stateCode });
    }, [addresses]);

    const email = useMemo(() => {
        return emails[0]?.leadEmail;
    }, [emails]);

    const getInitialAvatarValue = () => {
        if (!firstName && !lastName) {
            return "";
        }
        return (firstName?.[0] + lastName?.[0]).toUpperCase();
    };

    const initialAvatarValue = getInitialAvatarValue();

    return (
        <div className={styles.selectedAgentCard}>
            <BackButton
                onClick={() => {
                    setSelectedAgent(null);
                }}
                className={styles.backButton}
            />
            <div className={styles.avatarContainer}>
                <Avatar
                    sx={{
                        width: "130px",
                        height: "130px",
                        backgroundColor: "#052a63",
                        border: "1px solid #FFFFFF",
                        margin: "auto",
                        fontSize: "20px",
                    }}
                >
                    {initialAvatarValue}
                </Avatar>
            </div>
            <h2 className={styles.agentName}>
                {formatFullName({ firstName, lastName })}
            </h2>
            <div className={styles.stageContainer}>
                <StageCell initialValue={statusName} customWidth={"80%"} originalData={selectedAgent} />
            </div>
            <Divider sx={{ borderBottomWidth: "2px", width: "80%", margin: "auto" }} variant="middle" />
            <div className={styles.agentDetailsContainer}>
                <Grid container className={styles.agentDetailRow}>
                    <Grid item xs={2}>
                        <Tooltip arrow title={address} placement="top">
                            <span>
                                <LocationPin className={`${styles.iconStyle} ${styles.iconStylesLocation}`} />
                            </span>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={10}>
                        <p className={styles.agentDetailValue}>{address}</p>
                    </Grid>
                </Grid>
                <Grid container className={styles.agentDetailRow}>
                    <Grid item xs={2}>
                        <span className={phone ? "" : styles.disabled} onClick={phone ? handleCall : null}>
                            <ConnectPhone />
                        </span>
                    </Grid>
                    <Grid item xs={10}>
                        <p className={styles.agentDetailValue}>{formatPhoneNumber(phone)}</p>
                    </Grid>
                </Grid>
                <Grid container className={styles.agentDetailRow}>
                    <Grid item xs={2}>
                        <Link
                            to={`/contact/${leadsId}/communications?isNewTextOpen=true`}
                            className={styles.viewContactLink}
                        >
                            <CampaignTypeTextMessage className={styles.iconStyle} />
                        </Link>
                    </Grid>
                    <Grid item xs={10}>
                        <p className={styles.agentDetailValue}>{formatPhoneNumber(phone)}</p>
                    </Grid>
                </Grid>
                {email ? (
                    <Grid container className={styles.agentDetailRow}>
                        <Grid item xs={2}>
                            <a href={`mailto:${email}`}>
                                <Connectemail />
                            </a>
                        </Grid>
                        <Grid item xs={10}>
                            <p className={styles.agentDetailValue}>{email}</p>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container className={styles.agentDetailRow}>
                        <span className={styles.disabled}>
                            <Connectemail />
                        </span>
                    </Grid>
                )}
            </div>
            <Link to={`/contact/${leadsId}`} className={styles.viewContactLink}>
                <Button
                    label="View Contact"
                    onClick={() => {
                        setSelectedAgent(null);
                    }}
                    type="primary"
                    className={styles.viewContactButton}
                />
            </Link>
            {isScriptModalOpen && (
                <CallScriptModal
                    modalOpen={isScriptModalOpen}
                    handleClose={() => setIsScriptModalOpen(false)}
                    leadId={leadsId}
                    countyFips={addresses?.[0]?.countyFips}
                    postalCode={addresses?.[0]?.postalCode}
                />
            )}
        </div>
    );
}

SelectedAgentCard.propTypes = {
    selectedAgent: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        addresses: PropTypes.arrayOf(
            PropTypes.shape({
                address1: PropTypes.string,
                address2: PropTypes.string,
                postalCode: PropTypes.string,
                stateCode: PropTypes.string,
                countyFips: PropTypes.string,
            })
        ).isRequired,
        phones: PropTypes.arrayOf(
            PropTypes.shape({
                leadPhone: PropTypes.string,
            })
        ).isRequired,
        emails: PropTypes.arrayOf(
            PropTypes.shape({
                leadEmail: PropTypes.string,
            })
        ),
        leadsId: PropTypes.number.isRequired,
        statusName: PropTypes.string,
        leadTags: PropTypes.arrayOf(PropTypes.string),
        plan_enroll_profile_created: PropTypes.bool,
    }).isRequired,
    setSelectedAgent: PropTypes.func.isRequired,
};

export default SelectedAgentCard;
