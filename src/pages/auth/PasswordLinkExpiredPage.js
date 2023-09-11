import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import { useHistory } from "react-router-dom";
import useQueryParams from "hooks/useQueryParams";
import usePortalUrl from "hooks/usePortalUrl";

const requestPasswordReset = async (npn) => {
  const response = await fetch(
    `${process.env.REACT_APP_AUTH_AUTHORITY_URL}/api/v2.0/account/forgotpassword`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        npn,
      }),
    }
  );
  return response;
};

const PasswordResetExpiredPage = () => {
  const history = useHistory();
  const queryParams = useQueryParams();
  const portalUrl = usePortalUrl();

  const handleResendForgotPasswordEmail = async () => {
    const npn = queryParams.get("npn");
    const response = await requestPasswordReset(npn);

    if (response.status >= 200 && response.status < 300) {
      history.push(`password-reset-sent?npn=${npn}`);
    } else {
      history.push(
        `sorry?message=${encodeURIComponent(
          "We could not send a password reset at this time."
        )}`
      );
    }
  };

  const handleRedirectAndRestartLoginFlow = () => {
    window.location = portalUrl + "/signin";
  };

  return (
    <BaseConfirmationPage
      footer={
        <div className="mt-2 text-body">
          <button
            className="link link--force-underline"
            onClick={handleRedirectAndRestartLoginFlow}
          >
            Want to try a different email address?
          </button>
        </div>
      }
      title="We’re sorry"
      body="The link you used has expired."
      button={
        <button
          type="button"
          className="btn-v2"
          onClick={handleResendForgotPasswordEmail}
        >
          Resend Email
        </button>
      }
    />
  );
};

export default PasswordResetExpiredPage;
