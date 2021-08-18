import React from "react";
import { Helmet } from "react-helmet-async";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import ResendButtonWithModal from "partials/resend-email";
import analyticsService from "services/analyticsService";
import authService from "services/authService";
import useQueryParams from "hooks/useQueryParams";
import InfoIcon from "components/icons/info";
import useClientId from "hooks/auth/useClientId";

const resendComfirmEmail = async (params) => {
  return authService.sendConfirmationEmail(params);
};

export default () => {
  const clientId = useClientId();

  // TODO v2: Does this need to change from npn to email?
  const params = useQueryParams();

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Account Registration</title>
      </Helmet>
      <BaseConfirmationPage
        footer={
          <ResendButtonWithModal
            resendFn={resendComfirmEmail}
            btnClass={analyticsService.clickClass("registration-resendnow")}
          />
        }
        title={
          params.get("mode") !== "error"
            ? "Confirm your account"
            : "Something’s not right"
        }
        body={
          <React.Fragment>
            {params.get("mode") === "error" && (
              <p className="mb-2 mt-2">
                Your account’s email address hasn’t been confirmed. Complete the
                steps below before logging in or changing your password:
              </p>
            )}

            <div className="pt-1 pb-1 pr-1 pl-1 mb-2 confirm-notification">
              <InfoIcon />
              <p>
                Please confirm your account within <strong> 72 hours </strong>{" "}
                to complete registration.
              </p>
            </div>
            <ol className="number-list text-body pt-3">
              <li>
                <div>
                  Open the inbox for the email address that you registered with
                </div>
              </li>
              <li>
                <div>
                  {clientId === "ILSClient" ? (
                    <p className="mb-2">
                      Find the confirmation email from Integrity Lead Store
                      (IntegrityLeadStore@integritymarketing.com)
                    </p>
                  ) : (
                    <p className="mb-2">
                      Find the confirmation email from MedicareCENTER
                      (accounts@medicarecenter.com)
                    </p>
                  )}

                  <p className="text-body text-body--small">
                    Note: You may need to look in your spam/junk folder
                  </p>
                </div>
              </li>
              <li>
                {clientId === "ILSClient" ? (
                  <div>
                    Click the confirm button in the email to return to Integrity
                    Lead Store for login
                  </div>
                ) : (
                  <div>
                    Click the confirm button in the email to return to
                    MedicareCENTER for login
                  </div>
                )}
              </li>
            </ol>
          </React.Fragment>
        }
        button={null}
      />
    </React.Fragment>
  );
};
