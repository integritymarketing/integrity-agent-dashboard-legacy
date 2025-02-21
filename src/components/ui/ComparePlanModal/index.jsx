import { useState, useMemo, useEffect } from "react";
import * as Sentry from "@sentry/react";
import Media from "react-media";
import analyticsService from "services/analyticsService";
import useToast from "hooks/useToast";
import Modal from "components/ui/modal";
import ComparePlansByPlanName from "components/ui/ComparePlansByPlanName";
import { Button } from "../Button";
import ShareInputsValidator from "components/ShareInputsValidator";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import useUserProfile from "hooks/useUserProfile";
import "./index.scss";
import { useClientServiceContext } from "services/clientServiceProvider";
import SMSNotification from "components/SMSNotification";
import { Box, Typography } from "@mui/material";

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

const ComparePlanModal = ({
    modalOpen,
    handleCloseModal,
    comparePlans,
    setComparePlanModalOpen,
    handleRemovePlan,
    id,
    plansLoading,
    contactData,
}) => {
    const showToast = useToast();
    const userProfile = useUserProfile();
    const {
        agentInformation: { agentVirtualPhoneNumber, agentPurl },
    } = useAgentInformationByID();
    const { plansService } = useClientServiceContext();
    const { firstName, lastName, emails, phones, leadsId, addresses, agentNpn, middleName, birthdate } = contactData;

    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [newSelectedType, setNewSelectedType] = useState("email");
    const [existingSendType, setExistingSendType] = useState("");
    const leadEmail = emails?.find(({ leadEmail }) => leadEmail)?.leadEmail ?? "";
    const leadPhone = phones?.find(({ leadPhone }) => leadPhone)?.leadPhone ?? "";
    const isEmailCompatabileStatus = emails?.find(({ leadEmail }) => leadEmail)?.isValid;
    const isPhoneCompatabileStatus = phones?.find(({ leadPhone }) => leadPhone)?.isSmsCompatible;

    const nonFormatPhoneNumber = useMemo(() => (phone ? `${phone}`.replace(/\D/g, "") : ""), [phone]);

    useEffect(() => {
        if (modalOpen) {
            analyticsService.fireEvent("event-modal-appear", {
                modalName: "Compare Share Plans",
            });
        }
    }, [modalOpen]);

    const handleCleanUp = () => {
        setNewSelectedType("");
        setExistingSendType("");
        setEmail("");
        setPhone();
        handleCloseModal();
    };

    const handleShareComparePlans = async () => {
        const agentFirstName = userProfile.firstName;
        const agentLastName = userProfile.lastName;
        const agentEmail = userProfile.email;
        const roles = userProfile.roles ?? "";
        const agentPhoneNumber = agentVirtualPhoneNumber;
        const zipCode = addresses?.[0]?.postalCode;
        const stateCode = addresses?.[0]?.stateCode;
        const countyFIPS = addresses?.[0]?.countyFips;
        const urlPathName = window.location.pathname;
        let planCompareUrl = `${import.meta.env.VITE_MEDICARE_ENROLL}/customer${urlPathName}`;

        const extractIdsFromUrl = (url) => {
            const match = url.match(/\/compare\/([^/]+)/);
            return match ? match[1].split(",") : [];
        };

        const buildUrlWithFilteredIds = (url, selectedIds) => {
            const idsArray = extractIdsFromUrl(url);
            const filteredIds = idsArray.filter((id) => selectedIds.includes(id));
            const filteredIdsString = filteredIds.join(",");
            const baseUrl = url.split("/compare/")[0];
            const date = url.split("/").pop();
            const newUrl = `${baseUrl}/compare/${filteredIdsString}/${date}`;
            return newUrl;
        };

        const selectedIds = comparePlans?.map((plan) => plan.id) || [];
        planCompareUrl = buildUrlWithFilteredIds(planCompareUrl, selectedIds);
        let updatedRoles;
        if (typeof roles === "string") {
            updatedRoles = [roles];
        } else {
            updatedRoles = roles;
        }
        try {
            const payload = {
                leadFirstName: firstName,
                leadLastName: lastName,
                agentFirstName: agentFirstName,
                agentLastName: agentLastName,
                agentPhoneNumber: agentPhoneNumber,
                agentEmail: agentEmail,
                planCompareUrl,
                leadId: `${leadsId}`,
                agentNpn,
                zipCode,
                state: stateCode,
                countyFIPS,
                middleInitial: middleName === "" ? null : middleName,
                dateOfBirth: birthdate,
                roles: updatedRoles,
                agentPurl,
            };
            if (existingSendType === "email") {
                const data = {
                    ...payload,
                    messageDestination: leadEmail,
                    messageType: "email",
                };
                await plansService.sendPlanCompare(data);
            } else if (existingSendType === "textMessage") {
                const data = {
                    ...payload,
                    messageDestination: leadPhone,
                    messageType: "sms",
                };
                await plansService.sendPlanCompare(data);
            } else {
                if (newSelectedType === "email") {
                    const data = {
                        ...payload,
                        messageDestination: email,
                        messageType: "email",
                    };
                    await plansService.sendPlanCompare(data);
                } else {
                    const data = {
                        ...payload,
                        messageDestination: nonFormatPhoneNumber,
                        messageType: "sms",
                    };
                    await plansService.sendPlanCompare(data);
                }
            }
            showToast({
                message: "Plans sent to client",
            });
        } catch (error) {
            Sentry.captureException(error);
            console.error("Failed to share plan", error);
            showToast({
                type: "error",
                message: "Failed to share plan",
            });
        } finally {
            handleCleanUp();
        }
    };

    const isDisable = useMemo(() => {
        if (existingSendType === "email" && leadEmail && isEmailCompatabileStatus) {
            return true;
        } else if (existingSendType === "textMessage" && leadPhone && isPhoneCompatabileStatus) {
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
        isPhoneCompatabileStatus,
        isEmailCompatabileStatus,
    ]);

    return (
        <Media
            queries={{
                mobile: "(min-width: 320px) and (max-width: 480px)",
            }}
        >
            {(matches) => (
                <>
                    {modalOpen && (
                        <Modal
                            size="xlg"
                            wide={true}
                            open={true}
                            cssClassName={"shareplan-modal"}
                            onClose={handleCloseModal}
                            labeledById="sharePlan_label"
                            descById="sharePlan_desc"
                        >
                            <div className="shareplan-modal dialog--container">
                                <div className="dialog--title ">
                                    <h2 id="dialog_help_label" className="hdg hdg--2 mb-1 mble-title">
                                        Share Plans
                                    </h2>
                                </div>
                                <div>
                                    <ComparePlansByPlanName
                                        comparePlans={comparePlans}
                                        setComparePlanModalOpen={setComparePlanModalOpen}
                                        handleRemovePlan={handleRemovePlan}
                                        id={id}
                                        plansLoading={plansLoading}
                                        isModal={true}
                                        contactData={contactData}
                                    />
                                </div>
                                <ShareInputsValidator
                                    leadId={leadsId}
                                    title="How do you want to share this plan?"
                                    existingSendType={existingSendType}
                                    setExistingSendType={setExistingSendType}
                                    email={email}
                                    setEmail={setEmail}
                                    phone={phone}
                                    setPhone={setPhone}
                                    newSelectedType={newSelectedType}
                                    setNewSelectedType={setNewSelectedType}
                                />
                                {existingSendType === "newEmailOrMobile" && (
                                    <Box>
                                        <Typography variant="body2" color="#434A51" marginTop={0.5}>
                                            *This {newSelectedType === "mobile" ? "phone number" : "email"} will not be
                                            saved to the contact.
                                        </Typography>
                                    </Box>
                                )}
                                <SMSNotification />
                                <div className={"footer"}>
                                    <Button
                                        label="Share"
                                        data-gtm="button-share"
                                        onClick={handleShareComparePlans}
                                        disabled={!isDisable}
                                    />
                                    <Button
                                        fullWidth={matches.mobile}
                                        data-gtm="button-cancel"
                                        label={"Cancel"}
                                        onClick={handleCloseModal}
                                        type="secondary"
                                    />
                                </div>
                            </div>
                        </Modal>
                    )}
                </>
            )}
        </Media>
    );
};

export default ComparePlanModal;