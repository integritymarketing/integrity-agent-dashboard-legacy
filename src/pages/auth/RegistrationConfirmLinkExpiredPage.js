import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import { useHistory } from "react-router-dom";
import useQueryParams from "hooks/useQueryParams";
import authService from "services/authService";

export default () => {
  const history = useHistory();
  const params = useQueryParams();

  const handleResendComfirmEmail = async () => {
    const npn = params.get("npn");

    const response = await authService.sendConfirmationEmail({ npn });

    if (response.status >= 200 && response.status < 300) {
      history.push(`registration-email-sent?npn=${npn}`);
    } else {
      history.push(
        `sorry?message=${encodeURIComponent(
          "We could not send a new confirmation email at this time."
        )}`
      );
    }
  };

  return (
    <BaseConfirmationPage
      footer={
        <div className="mt-2 text-body">
          <button
            className="link link--force-underline"
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
          className="btn-v2"
          onClick={handleResendComfirmEmail}
        >
          Resend Email
        </button>
      }
    />
  );
};
