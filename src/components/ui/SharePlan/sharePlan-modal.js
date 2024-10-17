import React, { useState, useMemo, useEffect } from "react";
import * as Sentry from "@sentry/react";
import debounce from "debounce";
import Media from "react-media";
import analyticsService from "services/analyticsService";
import useUserProfile from "hooks/useUserProfile";
import useToast from "hooks/useToast";
import Modal from "components/ui/modal";
import CheckboxGroup from "components/ui/CheckboxGroup";
import CompactPlanCard from "../PlanCard/compact";
import Radio from "components/ui/Radio";
import { Button } from "../Button";
import { Select } from "components/ui/Select";
import { formatPhoneNumber } from "utils/phones";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import { useClientServiceContext } from "services/clientServiceProvider";
import "./styles.scss";
import { disableTextMessage, getCommunicationOptions } from "utilities/appConfig";
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

const SharePlanModal = ({
    modalOpen,
    planData = {},
    handleCloseModal,
    contact = {},
    enrollmentId,
    ispolicyShare = false,
    enrollData = {},
}) => {
    const showToast = useToast();
    const {
        agentInformation: { agentVirtualPhoneNumber, agentPurl },
    } = useAgentInformationByID();

    const { firstName, lastName, emails, phones, leadsId, birthdate, agentNpn, middleName, addresses } = contact;
    const { planRating = '', id, documents = [] } = planData || {};
    const leadEmail = emails?.[0]?.leadEmail ?? "";
    const leadPhone = phones?.[0]?.leadPhone ?? "";
    const addressData = addresses?.length > 0 ? addresses?.[0] : null;
    const countyFIPS = addressData && addressData?.countyFIPS ? addressData?.countyFIPS : "";
    const state = addressData && addressData?.stateCode ? addressData?.stateCode : "";

    const zipCode = addressData && addressData.postalCode ? addressData?.postalCode : "";

    const [selectLabel, setSelectLabel] = useState("email");
    const [selectOption, setSelectOption] = useState(null);
    const [formattedMobile, setFormattedMobile] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState("");
    const [hasFocus, setFocus] = useState(false);
    const [isDocumentsSelected, setIsDocumentsSelected] = useState(false);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const userProfile = useUserProfile();
    const { plansService, enrollPlansService } = useClientServiceContext();

    useEffect(() => {
        if (modalOpen) {
            analyticsService.fireEvent("event-modal-appear", {
                modalName: "Share Plans",
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

    const summaryBenfitURL = () => {
        const result = selectedDocuments.map((d) => ({
            key: d.name,
            value: d.url,
        }));
        return result;
    };

    const handleCleanUp = () => {
        setSelectOption("");
        setEmail("");
        setErrors("");
        setFormattedMobile("");
        setSelectLabel("email");
        handleCloseModal();
        setIsDocumentsSelected(false);
        setSelectedDocuments([]);
    };

    const enroll = async () => {
        setLoading(true);
        const agentFirstName = userProfile?.firstName;
        const agentLastName = userProfile?.lastName;
        const agentEmail = userProfile?.email;
        const roles = userProfile?.roles ?? "";
        const agentPhoneNumber = agentVirtualPhoneNumber;
        const urlPathName = window?.location?.pathname;
        const shareCurrentPlanSnapshotUrl = `${process.env.REACT_APP_MEDICARE_ENROLL}/customer${urlPathName}`;
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
                documentationLinks: summaryBenfitURL(),
                starRatingsLink: planRating.toString(),
                roles: updatedRoles,
            };
            const sharepolicyData = {
                leadFirstName: firstName,
                leadLastName: lastName,
                agentFirstName: agentFirstName,
                agentLastName: agentLastName,
                agentPhoneNumber: agentPhoneNumber,
                agentEmail: agentEmail,
                shareCurrentPlanSnapshotUrl,
                roles: updatedRoles,
                leadId: leadsId,
                agentNpn,
                zipCode,
                state,
                countyFIPS,
                middleInitial: middleName,
                dateOfBirth: birthdate,
                EnrollmentId: enrollmentId,
                enrollData: enrollData,
                appSubmitDate: enrollData?.submittedDate,
                agentPurl,
            };
            if (selectOption === "email") {
                const data = {
                    ...payload,
                    messageDestination: leadEmail,
                    messageType: "email",
                };
                if (ispolicyShare) {
                    const policyData = {
                        ...sharepolicyData,
                        messageDestination: leadEmail,
                        messageType: "email",
                    };
                    await enrollPlansService.sharePolicy(policyData);
                } else {
                    await plansService.sendPlan(data, leadsId, id);
                }
            } else if (selectOption === "textMessage") {
                const data = {
                    ...payload,
                    messageDestination: leadPhone,
                    messageType: "sms",
                };
                const policyData = {
                    ...sharepolicyData,
                    messageDestination: leadPhone,
                    messageType: "sms",
                };
                if (ispolicyShare) {
                    await enrollPlansService.sharePolicy(policyData);
                } else {
                    await plansService.sendPlan(data, leadsId, id);
                }
            } else {
                if (selectLabel === "email") {
                    const data = {
                        ...payload,
                        messageDestination: email,
                        messageType: "email",
                    };
                    if (ispolicyShare) {
                        const policyData = {
                            ...sharepolicyData,
                            messageDestination: email,
                            messageType: "email",
                        };
                        await enrollPlansService.sharePolicy(policyData);
                    } else {
                        await plansService.sendPlan(data, leadsId, id);
                    }
                } else {
                    const data = {
                        ...payload,
                        messageDestination: mobile,
                        messageType: "sms",
                    };

                    if (ispolicyShare) {
                        const policyData = {
                            ...sharepolicyData,
                            messageDestination: mobile,
                            messageType: "sms",
                        };
                        await enrollPlansService.sharePolicy(policyData);
                    } else {
                        await plansService.sendPlan(data, leadsId, id);
                    }
                }
            }
            showToast({
                message: "Successfully shared plan",
            });
        } catch (err) {
            Sentry.captureException(err);
            showToast({
                type: "error",
                message: "Failed to share plan",
            });
        } finally {
            handleCleanUp();
            setLoading(false);
        }
    };

    const idFormNotValid = useMemo(() => {
        if (selectOption === "newEmailOrMObile") {
            return selectLabel === "mobile" ? Boolean(mobile.length !== 10) : !emailRegex.test(email);
        }
        return !selectOption;
    }, [selectOption, selectLabel, mobile, email]);

    const handleOnDocumentChange = (e) => {
        const { checked, value: name } = e.target;
        const value = documents.filter((document) => document.name === name)[0];
        const result = checked
            ? [...selectedDocuments, value]
            : selectedDocuments.filter((document) => document.name !== value.name);
        setSelectedDocuments(result);
    };

    const handleContinue = (e) => {
        e.preventDefault();
        setIsDocumentsSelected(true);
    };
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
                            size="lg"
                            open={true}
                            wide
                            cssClassName={"shareplan-modal"}
                            onClose={() => handleCloseModal()}
                            labeledById="sharePlan_label"
                            descById="sharePlan_desc"
                        >
                            <div className="shareplan-modal dialog--container">
                                <div className="dialog--title ">
                                    <h2 id="dialog_help_label" className="hdg hdg--2 mb-1 mble-title">
                                        Share this Plan
                                    </h2>
                                </div>
                                {planData && <CompactPlanCard planData={planData} />}
                                {isDocumentsSelected || ispolicyShare ? (
                                    <>
                                        <div className={"shareplan-label"}>How do you want to share this plan?</div>
                                        <div className="select-scope-radios">
                                            {leadEmail && (
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
                                            )}
                                            {leadPhone && !disableTextMessage && (
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
                                                            className={`${mobile.length !== 10 && mobile.length !== 0
                                                                ? "error-class"
                                                                : ""
                                                                } text-input`}
                                                            onChange={(e) => {
                                                                setFormattedMobile(
                                                                    formatPhoneNumber(
                                                                        e.currentTarget.value.replace(/\D/g, "")
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                        {mobile.length !== 10 && mobile.length !== 0 && (
                                                            <span className="validation-msg">
                                                                Invalid mobile number
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <SMSNotification />
                                    </>
                                ) : (
                                    <div className="document-wrapper">
                                        <div className={"shareplan-label"}>What documents do you want to share?</div>
                                        <CheckboxGroup
                                            checkboxes={documents.map((document, index) => {
                                                return {
                                                    label:
                                                        planData.carrierName === "Aetna Medicare"
                                                            ? document.linkName
                                                            : document.name,
                                                    id: document.linkName,
                                                    name: "documents",
                                                    checked:
                                                        selectedDocuments.filter((item) => item === document)?.length >
                                                            0
                                                            ? true
                                                            : false,
                                                    value: document.name,
                                                    onChange: handleOnDocumentChange,
                                                };
                                            })}
                                        />
                                    </div>
                                )}
                                <div className={"footer"}>
                                    {isDocumentsSelected || ispolicyShare ? (
                                        <Button
                                            label="Share"
                                            data-gtm="button-share"
                                            onClick={enroll}
                                            disabled={idFormNotValid || loading}
                                        />
                                    ) : (
                                        <Button
                                            label="Continue"
                                            data-gtm="button-continue"
                                            onClick={handleContinue}
                                            disabled={selectedDocuments.length === 0}
                                        />
                                    )}
                                    <Button
                                        className={"cancel-button"}
                                        fullWidth={matches.mobile}
                                        data-gtm="button-cancel"
                                        label={"Cancel"}
                                        onClick={() => {
                                            handleCleanUp();
                                            handleCloseModal();
                                        }}
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

export default SharePlanModal;
