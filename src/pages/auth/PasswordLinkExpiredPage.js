import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import { useHistory } from "react-router-dom";

const getParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    npn: searchParams.get("npn"),
  };
};

const redirectAndRestartLoginFlow = () => {
  window.location = process.env.REACT_APP_PORTAL_URL;
};

export default () => {
  const history = useHistory();

  const handleResendForgotPasswordEmail = async () => {
    const body = getParams();

    const response = await fetch(
      process.env.REACT_APP_AUTH_AUTHORITY_URL + "/api/account/forgotpassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    if (response.status >= 200 && response.status < 300) {
      history.push(`password-reset-sent?npn=${body.npn}`);
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
