import React, { useState, useCallback } from "react";
import * as Sentry from "@sentry/react";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";
import Modal from "components/ui/modal";
import CompactPlanCard from "../PlanCard/compact";
import Radio from "components/ui/Radio";
import "./styles.scss";
import { Button } from "../Button";

export default ({
  modalOpen,
  planData,
  handleCloseModal,
  contact,
  effectiveDate,
}) => {
  const [option, setOption] = useState("");
  const addToast = useToast();
  const { plansService } = useClientServiceContext();

  const enroll = useCallback(async () => {
    try {
      const enrolled = await plansService.enroll(contact.leadsId, planData.id, {
        enrollRequest: {
          firstName: contact?.firstName,
          middleInitial:
            contact?.middleName?.length > 1 ? contact.middleName[0] : "",
          lastName: contact?.lastName,
          address1: contact?.addresses[0]?.address1,
          address2: contact?.addresses[0]?.address2,
          city: contact?.addresses[0]?.city,
          state: contact?.addresses[0]?.stateCode,
          zip: contact?.addresses[0]?.postalCode,
          countyFIPS: contact?.addresses[0]?.countyFips,
          phoneNumber: contact?.phones[0]?.leadPhone,
          email: contact?.emails[0]?.leadEmail,
          sendToBeneficiary: option === "send",
          effectiveDate: effectiveDate,
        },
        planDetail: planData,
      });

      if (enrolled && enrolled.url) {
        window.open(enrolled.url, "_blank").focus();
        addToast({
          type: "success",
          message: "Successfully Sent to Client",
        });
      } else {
        addToast({
          type: "error",
          message: "There was an error enrolling the contact.",
        });
      }
    } catch (e) {
      Sentry.captureException(e);
      addToast({
        type: "error",
        message: "There was an error enrolling the contact.",
      });
    } finally {
      handleCloseModal();
    }
  }, [
    planData,
    contact,
    addToast,
    option,
    handleCloseModal,
    effectiveDate,
    plansService,
  ]);

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
            <div className={"enrollment-label"}>
              How will you be completing this form?
            </div>
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
              <Button
                label={"Cancel"}
                onClick={handleCloseModal}
                type="secondary"
              />
            </div>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};
