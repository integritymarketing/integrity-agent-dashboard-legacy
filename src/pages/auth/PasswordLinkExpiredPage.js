import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import { useHistory } from "react-router-dom";
import useParams from "hooks/useParams";
import authService from "services/authService";

export default () => {
  const history = useHistory();
  const params = useParams();

  const handleResendForgotPasswordEmail = async () => {
    const npn = params.get("npn");

    const response = await authService.requestPasswordReset({ npn });

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

  return (
    <BaseConfirmationPage
      footer={
        <div className="mt-2 text-body">
          <button
            className="link link--invert link--force-underline"
            onClick={authService.redirectAndRestartLoginFlow}
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
          className="btn btn--invert"
          onClick={handleResendForgotPasswordEmail}
        >
          Resend Email
        </button>
      }
    />
  );
};
