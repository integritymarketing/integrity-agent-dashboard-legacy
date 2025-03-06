import React, { useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Media from "react-media";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import Container from "components/ui/container";
import Card from "components/ui/card";
import BackNavContext from "contexts/backNavProvider";
import { useClientServiceContext } from "services/clientServiceProvider";
import analyticsService from "services/analyticsService";
import ShareInputsValidator from "components/ShareInputsValidator";
import useUserProfile from "hooks/useUserProfile";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import "./index.scss";
import Track from "./Track";
import ArrowForwardWithCircle from "components/SharedModals/Icons/ArrowForwardWithCircle";
import SMSNotification from "components/SMSNotification";
import { useLeadDetails } from "providers/ContactDetails";
import { Button, Box, Typography } from "@mui/material";

export const __formatPhoneNumber = (phoneNumberString) => {
    const originalInput = phoneNumberString;
    const cleaned = `${phoneNumberString}`.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }

    if (cleaned === "") {
        return null;
    }

    return originalInput;
};

const NewScopeOfAppointment = ({ leadId, onCloseModal, refreshSOAList }) => {
    const showToast = useToast();
    const { setCurrentPage } = useContext(BackNavContext);
    const agentUserProfile = useUserProfile();
    const [isTracking, setIsTracking] = useState(true);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const { clientsService } = useClientServiceContext();
    const { leadDetails } = useLeadDetails();

    const [newSelectedType, setNewSelectedType] = useState("email");
    const [existingSendType, setExistingSendType] = useState("");

    const {
        agentInformation: { agentPurl },
    } = useAgentInformationByID();

    const handleCloseModal = () => {
        onCloseModal();
    };

    useEffect(() => {
        setCurrentPage("Scope of Appointment Page");
    }, []);

    const { firstName = "", lastName = "", emails = [], phones = [], leadsId } = leadDetails;

    const agentFirstName = agentUserProfile?.firstName;
    const agentLastName = agentUserProfile?.lastName;
    const agentEmail = agentUserProfile?.email;
    const agentPhoneNumber = agentUserProfile?.phone;
    const npnNumber = agentUserProfile?.npn;
    const leadEmail = emails?.find(({ leadEmail }) => leadEmail)?.leadEmail ?? "";
    const leadPhone = phones?.find(({ leadPhone }) => leadPhone)?.leadPhone ?? "";
    const isEmailCompatibleStatus = emails?.find(({ leadEmail }) => leadEmail)?.isValid;
    const isPhoneCompatibleStatus = phones?.find(({ leadPhone }) => leadPhone)?.isSmsCompatible;

    const nonFormatPhoneNumber = useMemo(() => (phone ? `${phone}`.replace(/\D/g, "") : ""), [phone]);

    const handleSend = async () => {
        try {
            const payload = {
                leadFirstName: firstName,
                leadLastName: lastName,
                agentFirstName: agentFirstName,
                agentLastName: agentLastName,
                agentPhoneNumber: agentPhoneNumber,
                agentEmail: agentEmail,
                agentNpn: npnNumber,
                isTracking48HoursWaitingPeriod: isTracking,
                agentPurl,
            };
            if (existingSendType === "email") {
                const data = {
                    ...payload,
                    messageDestination: leadEmail,
                    messageType: "email",
                };
                await clientsService.sendSoaInformation(data, leadsId);
            } else if (existingSendType === "textMessage") {
                const data = {
                    ...payload,
                    messageDestination: leadPhone,
                    messageType: "sms",
                };
                await clientsService.sendSoaInformation(data, leadsId);
            } else {
                if (newSelectedType === "email") {
                    const data = {
                        ...payload,
                        messageDestination: email,
                        messageType: "email",
                    };
                    await clientsService.sendSoaInformation(data, leadsId);
                } else {
                    const data = {
                        ...payload,
                        messageDestination: nonFormatPhoneNumber,
                        messageType: "sms",
                    };
                    await clientsService.sendSoaInformation(data, leadsId);
                }
            }
            handleCloseModal();
            showToast({
                message: "Scope of Appointment sent",
            });
            refreshSOAList && refreshSOAList(leadId);
            analyticsService.fireEvent("event-form-submit-valid", {
                formName: "New Scope Appointment",
            });
        } catch (err) {
            Sentry.captureException(err);
            showToast({
                type: "error",
                message: "Failed to send Scope of Appointment",
            });
        }
    };

    const isDisable = useMemo(() => {
        if (existingSendType === "email" && leadEmail && isEmailCompatibleStatus) {
            return true;
        } else if (existingSendType === "textMessage" && leadPhone && isPhoneCompatibleStatus) {
            return true;
        } else if (existingSendType === "newEmailOrMobile") {
            if (newSelectedType === "email" && email) {
                return true;
            } else if (newSelectedType === "mobile" && phone) {
                return true;
            }
        }
    }, [
        existingSendType,
        leadEmail,
        leadPhone,
        newSelectedType,
        email,
        phone,
        isPhoneCompatibleStatus,
        isEmailCompatibleStatus,
    ]);

    return (
        <>
            <Media
                query={"(max-width: 940px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <Container className="new-sop-page">
                <Card className="new-scope-card">
                    <div>
                        <ShareInputsValidator
                            leadId={leadId}
                            title="Please select where you would like to send the SOA:"
                            existingSendType={existingSendType}
                            setExistingSendType={setExistingSendType}
                            email={email}
                            setEmail={setEmail}
                            phone={phone}
                            setPhone={setPhone}
                            newSelectedType={newSelectedType}
                            setNewSelectedType={setNewSelectedType}
                        />
                    </div>
                    <SMSNotification />
                    <Track onCheckChange={setIsTracking} />
                </Card>
                {existingSendType === "newEmailOrMobile" && (
                    <Box>
                        <Typography variant="body2" color="#434A51" marginTop={0.5}>
                            *This {newSelectedType === "mobile" ? "phone number" : "email"} will not be saved to the
                            contact.
                        </Typography>
                    </Box>
                )}
                <Box className="buttonsContainer">
                    <Button variant="text" color="primary" onClick={handleCloseModal}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSend}
                        endIcon={<ArrowForwardWithCircle />}
                        disabled={!isDisable}
                    >
                        Send SOA
                    </Button>
                </Box>
            </Container>
        </>
    );
};

NewScopeOfAppointment.propTypes = {
    leadId: PropTypes.string.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    refreshSOAList: PropTypes.func.isRequired,
};

export default NewScopeOfAppointment;
