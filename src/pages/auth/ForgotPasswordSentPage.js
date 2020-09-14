import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import ResendButtonWithModal from "partials/resend-email";
import analyticsService from "services/analytics";
import authService from "services/authService";

const resendForgotPassword = async (npn) => {
  return authService.requestPasswordReset({ npn });
};

export default () => {
  return (
    <BaseConfirmationPage
      footer={
        <ResendButtonWithModal
          resendFn={resendForgotPassword}
          btnClass={analyticsService.clickClass("forgot-resendnow")}
        />
      }
      title="Thank you"
      body="If there is an account associated with NPN number entered you will receive an email with a link to reset your password"
    />
  );
};
