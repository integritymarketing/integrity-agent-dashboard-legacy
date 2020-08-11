import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import ResendButtonWithModal from "partials/resend-email";

const getParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    npn: searchParams.get("npn"),
  };
};

const resendForgotPassword = async (npn) => {
  return await fetch(
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
};

export default () => {
  return (
    <BaseConfirmationPage
      footer={
        <ResendButtonWithModal
          resendFn={resendForgotPassword}
          npn={getParams().npn}
        />
      }
      title="Thank you"
      body="If there is an account associated with the email address entered we will send a link to reset your account password."
    />
  );
};
