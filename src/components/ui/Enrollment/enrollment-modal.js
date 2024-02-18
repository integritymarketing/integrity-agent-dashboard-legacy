import * as Sentry from "@sentry/react";
import React, { useCallback, useState } from "react";

import useAnalytics from "hooks/useAnalytics";
import useToast from "hooks/useToast";
import { PLAN_TYPE_ENUMS } from "../../../constants";

import Radio from "components/ui/Radio";
import Modal from "components/ui/modal";

import enrollPlansService from "services/enrollPlansService";

import "./styles.scss";

import { Button } from "../Button";
import CompactPlanCard from "../PlanCard/compact";

const EnrollmentModal = ({ modalOpen, planData, handleCloseModal, contact, effectiveDate }) => {
    const [option, setOption] = useState("");
    const showToast = useToast();
    const { fireEvent } = useAnalytics();

    const enroll = useCallback(async () => {
        console.log("Enroll in Plan : Health Submitted CTA Clicked Triggered");
        fireEvent("Health Submitted CTA Clicked", {
            leadid: contact.leadsId,
            line_of_business: "Health",
            product_type: PLAN_TYPE_ENUMS[planType]?.toLowerCase(),
            selection: option === "send" ? "client_application_selected" : "agent_application_selected",
        });
        try {
            const enrolled = await enrollPlansService.enroll(contact.leadsId, planData.id, {
                enrollRequest: {
                    firstName: contact?.firstName,
                    middleInitial: contact?.middleName?.length > 1 ? contact.middleName[0] : "",
                    lastName: contact?.lastName,
                    dateOfBirth: contact?.birthdate,
                    address1: contact?.addresses?.[0]?.address1,
                    address2: contact?.addresses?.[0]?.address2,
                    city: contact?.addresses?.[0]?.city,
                    state: contact?.addresses?.[0]?.stateCode,
                    zip: contact?.addresses?.[0]?.postalCode,
                    countyFIPS: contact?.addresses?.[0]?.countyFips,
                    phoneNumber: contact?.phones[0]?.leadPhone,
                    email: contact?.emails[0]?.leadEmail,
                    sendToBeneficiary: option === "send",
                    effectiveDate: effectiveDate,
                },
                planDetail: planData,
            });

            if (enrolled && enrolled.url) {
                window.open(enrolled.url, "_blank").focus();
                showToast({
                    type: "success",
                    message: "Successfully Sent to Client",
                });
            } else {
                showToast({
                    type: "error",
                    message: "There was an error enrolling the contact.",
                });
            }
        } catch (e) {
            Sentry.captureException(e);
            showToast({
                type: "error",
                message: "There was an error enrolling the contact.",
            });
        } finally {
            handleCloseModal();
        }
    }, [planData, contact, showToast, option, handleCloseModal, effectiveDate]);

    return (
        <React.Fragment>
            {modalOpen && (
                <Modal
                    open={true}
                    wide
                    cssClassName={"enrollment-modal"}
                    onClose={() => handleCloseModal()}
                    labeledById="enroll_label"
                    descById="enroll_desc"
                >
                    <div className="enrollment-modal dialog--container">
                        <div className="dialog--title ">
                            <h2 id="dialog_help_label" className="hdg hdg--2 mb-1 mble-title">
                                Enroll in Plan
                            </h2>
                        </div>
                        {planData && <CompactPlanCard planData={planData} />}
                        <div className={"enrollment-label"}>How will you be completing this form?</div>
                        <Radio
                            name={"enrollModal"}
                            htmlFor={"send"}
                            id={"send"}
                            label={`Send the enrollment link to the client`}
                            checked={option === "send"}
                            onChange={() => setOption("send")}
                        />
                        <Radio
                            name={"enrollModal"}
                            htmlFor={"complete"}
                            id={"complete"}
                            label={`Agent to complete the enrollment forms themselves`}
                            checked={option === "complete"}
                            onChange={() => setOption("complete")}
                        />
                        <div className={"footer"}>
                            <Button label={"Continue"} onClick={enroll} disabled={!option} />
                            <Button label={"Cancel"} onClick={handleCloseModal} type="secondary" />
                        </div>
                    </div>
                </Modal>
            )}
        </React.Fragment>
    );
};

export default EnrollmentModal;
