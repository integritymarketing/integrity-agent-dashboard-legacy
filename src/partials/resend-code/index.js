import { useCallback } from "react";
import PropTypes from "prop-types";
import * as Sentry from "@sentry/react";
import Modal from "components/ui/modal";
import { formatPhoneNumber } from "utils/phones";
import { Button } from "components/ui/Button";
import useToast from "hooks/useToast";
import { useClientServiceContext } from "services/clientServiceProvider";

const ResendCodeModal = ({ agentInfo, modalOpen, close, token, request }) => {
    const showToast = useToast();
    const { plansService } = useClientServiceContext();
    const { AgentPhoneNumber, AgentFirstName, AgentLastName, AgentEmail } = agentInfo;

    const handleResendCode = useCallback(async () => {
        const data = { token, request };
        try {
            await plansService.resendCode(data);
            showToast({ message: "Your code has been resent." });
        } catch (err) {
            Sentry.captureException(err);
            showToast({
                type: "error",
                message: "Failed to resend code",
            });
        }
    }, [token, request, plansService, showToast]);

    return (
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
            <Button className="mb-2" label="Resend Code" onClick={handleResendCode} />
            <p id="dialog_help_desc" className="text-body mb-4">
                If you don't receive the code in the next couple of hours, please contact me and I'll make sure I have
                the right phone number or email address.
            </p>
            <div className="agent-details">
                <div className="agent-name hdg--2 pb-1">
                    {AgentFirstName} {AgentLastName}
                </div>
                <div className="pb-2">
                    <span className="hdg hdg--4">Phone Number: &nbsp;</span>
                    <span className="text-body">
                        <a href={`tel:${AgentPhoneNumber}`} className="link">
                            {formatPhoneNumber(AgentPhoneNumber)}
                        </a>
                    </span>
                </div>
                <div>
                    <span className="hdg hdg--4 pb-4">Email: &nbsp;</span>
                    <span className="text-body pb-4">
                        <a href={`mailto:${AgentEmail}`} className="link">
                            {AgentEmail}
                        </a>
                    </span>
                </div>
            </div>
        </Modal>
    );
};

ResendCodeModal.propTypes = {
    agentInfo: PropTypes.shape({
        AgentPhoneNumber: PropTypes.string,
        AgentFirstName: PropTypes.string,
        AgentLastName: PropTypes.string,
        AgentEmail: PropTypes.string,
    }).isRequired,
    modalOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    request: PropTypes.string.isRequired,
};

export default ResendCodeModal;
