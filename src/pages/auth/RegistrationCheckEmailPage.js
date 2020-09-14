import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import ResendButtonWithModal from "partials/resend-email";
import analyticsService from "services/analytics";
import authService from "services/authService";

const resendComfirmEmail = async (npn) => {
  return authService.sendConfirmationEmail({ npn });
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
