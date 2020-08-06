import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";

const getParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    npn: searchParams.get("npn"),
  };
};

const redirectAndRestartLoginFlow = () => {
  window.location = process.env.REACT_APP_PORTAL_HOST_URL;
};

const handleResendComfirmEmail = async () => {
  const body = getParams();
  return await fetch(
    process.env.REACT_APP_AUTH_AUTHORITY_URL +
      "/api/account/resendconfirmemail",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    }
  );
};

export default () => {
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
          onClick={handleResendComfirmEmail}
        >
          Resend Email
        </button>
      }
    />
  );
};
