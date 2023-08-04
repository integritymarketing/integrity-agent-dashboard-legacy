import React, { useCallback } from "react";
import * as Sentry from "@sentry/react";
import Modal from "components/ui/modal";
import { formatPhoneNumber } from "utils/phones";
import { Button } from "components/ui/Button";
import useToast from "hooks/useToast";
import { useClientServiceContext } from "services/clientServiceProvider";

export default ({ agentInfo, modalOpen, close, token, request }) => {
  const addToast = useToast();
  const { plansService } = useClientServiceContext();
  const { AgentPhoneNumber, AgentFirstName, AgentLastName, AgentEmail } =
    agentInfo;

  const handleResendCode = useCallback(async () => {
    const data = {
      token,
      request,
    };
    try {
      await plansService.resendCode(data);
      addToast({
        message: "Your code has been resent.",
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to resend code",
      });
    } finally {
    }
  }, [addToast, plansService, request, token]);

  return (
    <>
      <Modal
        open={modalOpen}
        cssClassName={"resend-code-modal"}
        onClose={close}
        labeledById="resendCode_label"
        descById="resendCode_desc"
      >
        <h2 id="dialog_help_label" className="hdg hdg--2 mb-1">
          Need to Resend Code?
        </h2>
        <Button
          className="mb-2"
          label="Resend Code"
          onClick={handleResendCode}
        />
        <p id="dialog_help_desc" className="text-body mb-4">
          If dont receive the code in the next couple of hours please contact me
          and i'll make sure i have the right phone number or email address.
        </p>
        <div className="agent-details">
          <div className="agent-name hdg--2 pb-1">
            {AgentFirstName} {AgentLastName}
          </div>
          <div className="pb-2">
            <span className="hdg hdg--4">Phone Number: &nbsp;</span>
            <span className="text-body">
              <a href="tel:+1-888-818-3760" className="link">
                {formatPhoneNumber(AgentPhoneNumber)}
              </a>
            </span>
          </div>
          <div>
            <div>
              <span className="hdg hdg--4 pb-4">Email: &nbsp;</span>
              <span className="text-body pb-4">
                <a href={`mailto:${AgentEmail}`} className="link">
                  {AgentEmail}
                </a>
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
