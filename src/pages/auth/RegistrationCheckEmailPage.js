import React from "react";
import { Helmet } from "react-helmet";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import ResendButtonWithModal from "partials/resend-email";
import analyticsService from "services/analyticsService";
import authService from "services/authService";
import useQueryParams from "hooks/useQueryParams";

const resendComfirmEmail = async (npn) => {
  return authService.sendConfirmationEmail({ npn });
};

export default () => {
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
            ? "You're Almost Done!"
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
            <ol className="number-list text-body pt-3">
              <li>
                <div>
                  Open the inbox for the email address that you registered with
                </div>
              </li>
              <li>
                <div>
                  <p className="mb-2">
                    Find the confirmation email from MedicareCENTER
                    (service@integritymarketing.com)
                  </p>
                  <p className="text-body text-body--small">
                    Note: You may need to look in your spam/junk folder
                  </p>
                </div>
              </li>
              <li>
                <div>
                  Click the confirm button in the email to return to
                  MedicareCENTER for login
                </div>
              </li>
            </ol>
          </React.Fragment>
        }
        button={null}
      />
    </React.Fragment>
  );
};
