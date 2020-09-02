import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import ResendButtonWithModal from "partials/resend-email";
import analyticsService from "services/analytics";

const resendComfirmEmail = async (npn) => {
  return await fetch(
    process.env.REACT_APP_AUTH_AUTHORITY_URL +
      "/api/account/resendconfirmemail",
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
          resendFn={resendComfirmEmail}
          btnClass={analyticsService.clickClass("registration-resendnow")}
        />
      }
      title="Thank you"
      body="Please follow the link sent to your email to complete the registration process."
    />
  );
};
