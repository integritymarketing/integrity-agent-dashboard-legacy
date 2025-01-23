import { useState, useMemo, useEffect } from "react";
import * as Sentry from "@sentry/react";
import debounce from "debounce";
import Media from "react-media";
import analyticsService from "services/analyticsService";
import useToast from "hooks/useToast";
import Modal from "components/ui/modal";
import ComparePlansByPlanName from "components/ui/ComparePlansByPlanName";
import Radio from "components/ui/Radio";
import { Button } from "../Button";
import { Select } from "components/ui/Select";
import { formatPhoneNumber } from "utils/phones";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import useUserProfile from "hooks/useUserProfile";
import "./index.scss";
import { disableTextMessage, getCommunicationOptions } from "utilities/appConfig";
import { useClientServiceContext } from "services/clientServiceProvider";
import SMSNotification from "components/SMSNotification";

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

const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
    const leadEmail = emails?.[0]?.leadEmail ?? "";
    const leadPhone = phones?.[0]?.leadPhone ?? "";
    const [selectLabel, setSelectLabel] = useState("email");
    const [selectOption, setSelectOption] = useState("email");
    const [formattedMobile, setFormattedMobile] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState("");
    const [hasFocus, setFocus] = useState(false);

    useEffect(() => {
        if (modalOpen) {
            analyticsService.fireEvent("event-modal-appear", {
                modalName: "Compare Share Plans",
            });
        }
    }, [modalOpen]);

    const mobile = useMemo(() => (formattedMobile ? `${formattedMobile}`.replace(/\D/g, "") : ""), [formattedMobile]);

    const validateEmail = debounce((email) => {
        if (emailRegex.test(email)) {
            setErrors(null);
        } else {
            setErrors("Invalid email address");
        }
    }, 1000);

    const handleSetEmail = (_email) => {
        const email = _email.trim();
        setEmail(email);
        validateEmail(email);
    };

    const handleCleanUp = () => {
        setSelectOption("email");
        setEmail("");
        setErrors("");
        setFormattedMobile("");
        setSelectLabel("email");
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
            if (selectOption === "email") {
                const data = {
                    ...payload,
                    messageDestination: leadEmail,
                    messageType: "email",
                };
                await plansService.sendPlanCompare(data);
            } else if (selectOption === "textMessage") {
                const data = {
                    ...payload,
                    messageDestination: leadPhone,
                    messageType: "sms",
                };
                await plansService.sendPlanCompare(data);
            } else {
                if (selectLabel === "email") {
                    const data = {
                        ...payload,
                        messageDestination: email,
                        messageType: "email",
                    };
                    await plansService.sendPlanCompare(data);
                } else {
                    const data = {
                        ...payload,
                        messageDestination: mobile,
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
            showToast({
                type: "error",
                message: "Failed to share plan",
            });
        } finally {
            handleCleanUp();
        }
    };

    const idFormNotValid = useMemo(() => {
        if (selectOption === "newEmailOrMObile") {
            return selectLabel === "mobile" ? Boolean(mobile.length !== 10) : !emailRegex.test(email);
        }
        return !selectOption;
    }, [selectOption, selectLabel, mobile, email]);

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
                                <div className={"shareplan-label"}>How do you want to share this plan?</div>
                                <div className="select-scope-radios">
                                    <Radio
                                        id="email"
                                        data-gtm="input-share-plans"
                                        htmlFor="email"
                                        label={`Email (${leadEmail})`}
                                        name="share-plan"
                                        value="email"
                                        checked={selectOption === "email"}
                                        onChange={(event) => setSelectOption(event.currentTarget.value)}
                                    />
                                    {!disableTextMessage && (
                                        <Radio
                                            id="textMessage"
                                            data-gtm="input-share-plans"
                                            htmlFor="textMessage"
                                            label={`Text Message (${__formatPhoneNumber(leadPhone)})`}
                                            name="share-plan"
                                            value="textMessage"
                                            checked={selectOption === "textMessage"}
                                            onChange={(event) => setSelectOption(event.currentTarget.value)}
                                        />
                                    )}
                                    <Radio
                                        id="newEmailOrMobile"
                                        data-gtm="input-share-plans"
                                        htmlFor="newEmailOrMobile"
                                        label={disableTextMessage ? "New email" : "New email or mobile number"}
                                        name="share-plan"
                                        value="newEmailOrMObile"
                                        checked={selectOption === "newEmailOrMObile"}
                                        onChange={(event) => setSelectOption(event.currentTarget.value)}
                                    />
                                </div>
                                {selectOption === "newEmailOrMObile" && (
                                    <div className="new-email-or-mobile">
                                        <Select
                                            className="mr-2"
                                            options={getCommunicationOptions()}
                                            style={{ width: "140px" }}
                                            initialValue={selectLabel}
                                            providerModal={true}
                                            onChange={setSelectLabel}
                                            showValueAlways={true}
                                        />
                                        {selectLabel === "email" && (
                                            <div className="email-mobile-section">
                                                <input
                                                    autoComplete="on"
                                                    type="text"
                                                    data-gtm="input-share-plans"
                                                    onFocus={() => setFocus(true)}
                                                    onBlur={() => setFocus(false)}
                                                    placeholder={hasFocus ? "" : "Enter email"}
                                                    value={email}
                                                    className={`${errors && "error-class"} text-input`}
                                                    onChange={(e) => {
                                                        handleSetEmail(e.currentTarget.value);
                                                    }}
                                                />
                                                {errors && <span className="validation-msg">{errors}</span>}
                                            </div>
                                        )}
                                        {selectLabel === "mobile" && (
                                            <div className="email-mobile-section">
                                                <input
                                                    type="text"
                                                    data-gtm="input-share-plans"
                                                    onFocus={() => setFocus(true)}
                                                    onBlur={() => setFocus(false)}
                                                    placeholder={hasFocus ? "" : "XXX-XXX-XXXX"}
                                                    value={formattedMobile}
                                                    maxLength="10"
                                                    className={`${
                                                        mobile.length !== 10 && mobile.length !== 0 ? "error-class" : ""
                                                    } text-input`}
                                                    onChange={(e) => {
                                                        setFormattedMobile(
                                                            formatPhoneNumber(e.currentTarget.value.replace(/\D/g, "")),
                                                        );
                                                    }}
                                                />
                                                {mobile.length !== 10 && mobile.length !== 0 && (
                                                    <span className="validation-msg">Invalid mobile number</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <SMSNotification />
                                <div className={"footer"}>
                                    <Button
                                        label="Share"
                                        data-gtm="button-share"
                                        onClick={handleShareComparePlans}
                                        disabled={idFormNotValid}
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
