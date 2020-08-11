import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import { useHistory } from "react-router-dom";
import useParams from "hooks/useParams";

export default () => {
  const history = useHistory();
  const params = useParams();

  const redirectAndRestartLoginFlow = () => {
    window.location = process.env.REACT_APP_PORTAL_URL;
  };

  const handleResendForgotPasswordEmail = async () => {
    const npn = params.get("npn");

    const response = await fetch(
      process.env.REACT_APP_AUTH_AUTHORITY_URL + "/api/account/forgotpassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ npn: npn }),
      }
    );

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
        <div className="text-center text-body">
          <button className="link" onClick={redirectAndRestartLoginFlow}>
            Want to try a different email address?
          </button>
        </div>
      }
      title="We’re sorry"
      body="The link you used has expired."
      button={
        <button
          type="button"
          className="btn"
          onClick={handleResendForgotPasswordEmail}
        >
          Resend Email
        </button>
      }
    />
  );
};
