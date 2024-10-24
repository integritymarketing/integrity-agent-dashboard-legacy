import { InfoWindow, Marker, useMarkerRef } from "@vis.gl/react-google-maps";
import { useCallback, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { StageStatusContext } from "contexts/stageStatus";
import { PinMarkerSvg } from "./images/pinMarkerSvg";
import { ClusterSvg } from "./images/ClusterSvg";
import styles from "./styles.module.scss";
import { Avatar, Button, Popover, useMediaQuery } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { ConnectPhone } from "components/icons/version-2/ConnectPhone";
import Connectemail from "components/icons/version-2/ConnectEmail";
import { Close, CampaignTypeTextMessage, LocationPin } from "@integritymarketing/icons";
import { Link } from "react-router-dom";
import { CallScriptModal } from "packages/CallScriptModal";
import useToast from "hooks/useToast";
import useAnalytics from "hooks/useAnalytics";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import useFetch from "hooks/useFetch";
import { formatAddress } from "utils/addressFormatter";
import { formatFullName } from "utils/formatFullName";

const NOT_AVAILABLE = "N/A";

export const MarkerWithInfoWindow = ({ contactGroupItem, selectedAgent, handleMarkerClick, handleClose }) => {
    const [markerRef, marker] = useMarkerRef();
    const showToast = useToast();
    const [isInfoWindowClosed, setIsInfoWindowClosed] = useState(false);
    const { fireEvent } = useAnalytics();
    const { agentInformation } = useAgentInformationByID();
    const { agentID, callForwardNumber, agentVirtualPhoneNumber, agentNPN } = agentInformation || {};
    const formattedPhoneNumber = agentVirtualPhoneNumber?.replace(/^\+1/, "");
    const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
    const { statusOptions } = useContext(StageStatusContext);
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
    } = selectedAgent || {};
    const { Post: outboundCallFromMedicareCenter } = useFetch(
        `${process.env.REACT_APP_COMMUNICATION_API}/Call/CallCustomer`
    );

    const isMobile = useMediaQuery("(max-width: 600px)");

    const address = useMemo(() => {
        const addressFirst = addresses?.[0];
        return formatAddress(addressFirst || {});
    }, [addresses]);

    const phone = useMemo(() => {
        return phones?.[0]?.leadPhone;
    }, [phones]);

    const email = useMemo(() => {
        return emails?.[0]?.leadEmail;
    }, [emails]);

    const getInitialAvatarValue = () => {
        if (!firstName && !lastName) {
            return "";
        }
        return (firstName?.[0] + lastName?.[0]).toUpperCase();
    };

    const initialAvatarValue = getInitialAvatarValue();

    const markerIcon = useMemo(() => {
        const leadsStatusId = contactGroupItem.leadStatusId;
        const allStatusesOptions = [...statusOptions];
        const foundHexValue = allStatusesOptions.find((item) => item.statusId === leadsStatusId)?.color;
        return PinMarkerSvg(foundHexValue) || PinMarkerSvg("#C1C1C1");
    }, [statusOptions, contactGroupItem]);

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
        plan_enroll_profile_created,
        statusName,
    ]);

    const handleOnClickClose = () => {
        setIsInfoWindowClosed(true);
        setTimeout(() => {
            handleClose();
            setIsInfoWindowClosed(false);
        }, 100);
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const handleLocationClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? "address-popover" : undefined;

    return (
        <>
            {contactGroupItem.isCluster ? (
                <Marker
                    ref={markerRef}
                    position={contactGroupItem.position}
                    onClick={() => handleMarkerClick(contactGroupItem)}
                    icon={{ url: ClusterSvg(contactGroupItem.agents?.length) }}
                />
            ) : (
                <Marker
                    ref={markerRef}
                    position={contactGroupItem.position}
                    onClick={() => handleMarkerClick(contactGroupItem)}
                    icon={markerIcon}
                />
            )}
            {selectedAgent && selectedAgent.leadsId === contactGroupItem.leadsId && !isInfoWindowClosed && (
                <InfoWindow anchor={marker} className={styles.infoWindow}>
                    <div className={styles.closeRow}>
                        <span onClick={handleOnClickClose}>
                            <Close />
                        </span>
                    </div>
                    <div className={styles.infoWindowBody}>
                        <div className={styles.nameColumn}>
                            <h2 className={styles.agentName}>{formatFullName(firstName, null, lastName)}</h2>
                            <div className={styles.agentDetailsRow}>
                                {isMobile ? (
                                    <>
                                        <span onClick={handleLocationClick} aria-describedby={id}>
                                            <LocationPin className={`${styles.iconStyle} ${styles.iconStylesLocation}`} />
                                        </span>
                                        <Popover
                                            id={id}
                                            open={open}
                                            anchorEl={anchorEl}
                                            onClose={() => setAnchorEl(null)}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "center",
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "center",
                                            }}
                                        >
                                            <div className={styles.addressPopover}>{address}</div>
                                        </Popover>
                                    </>
                                ) : (
                                    <Tooltip arrow title={address} placement="top">
                                        <span>
                                            <LocationPin className={`${styles.iconStyle} ${styles.iconStylesLocation}`} />
                                        </span>
                                    </Tooltip>
                                )}
                                <span className={phone ? "" : styles.disabled} onClick={phone ? handleCall : null}>
                                    <ConnectPhone />
                                </span>
                                <Link
                                    to={`/contact/${selectedAgent.leadsId}/communications?isNewTextOpen=true`}
                                    className={styles.viewContactLink}
                                >
                                    <CampaignTypeTextMessage className={styles.iconStyle} />
                                </Link>
                                {email ? (
                                    <a href={`mailto:${email}`}>
                                        <Connectemail />
                                    </a>
                                ) : (
                                    <span className={styles.disabled}>
                                        <Connectemail />
                                    </span>
                                )}
                            </div>
                            <div>
                                <Link to={`/contact/${selectedAgent.leadsId}`} className={styles.viewContactLink}>
                                    <Button className={styles.viewContactButton}>View Contact</Button>
                                </Link>
                            </div>
                        </div>
                        <div className={styles.photoColumn}>
                            <Avatar
                                sx={{
                                    width: "100px",
                                    height: "100px",
                                    backgroundColor: "#052a63",
                                    border: "1px solid #FFFFFF",
                                    margin: "auto",
                                    fontSize: "20px",
                                }}
                            >
                                {initialAvatarValue}
                            </Avatar>
                        </div>
                    </div>
                </InfoWindow>
            )}
            {isScriptModalOpen && (
                <CallScriptModal
                    modalOpen={isScriptModalOpen}
                    handleClose={() => setIsScriptModalOpen(false)}
                    leadId={leadsId}
                    countyFips={addresses?.[0]?.countyFips}
                    postalCode={addresses?.[0]?.postalCode}
                />
            )}
        </>
    );
};

MarkerWithInfoWindow.propTypes = {
    contactGroupItem: PropTypes.shape({
        leadStatusId: PropTypes.number.isRequired,
        isCluster: PropTypes.bool.isRequired,
        position: PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
        }).isRequired,
        agents: PropTypes.arrayOf(PropTypes.object),
        leadsId: PropTypes.number,
    }).isRequired,
    selectedAgent: PropTypes.object,
    handleMarkerClick: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default MarkerWithInfoWindow;
