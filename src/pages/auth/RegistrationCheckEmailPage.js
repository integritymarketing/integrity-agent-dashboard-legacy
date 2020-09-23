import React from "react";
import { Helmet } from "react-helmet";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import ResendButtonWithModal from "partials/resend-email";
import analyticsService from "services/analyticsService";
import authService from "services/authService";

const resendComfirmEmail = async (npn) => {
  return authService.sendConfirmationEmail({ npn });
};

export default () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Account Registration</title>
      </Helmet>
      <BaseConfirmationPage
        footer={
          <ResendButtonWithModal
            resendFn={resendComfirmEmail}
            btnClass={analyticsService.clickClass("registration-resendnow")}
          />
        }
        title="You're Almost Done!"
        body="Your MedicareCENTER account registration is almost complete! Please check your email (including spam/junk folders) for your registration confirmation link. Clicking that link will complete the registration process and allow you to login."
        button={null}
      />
    </React.Fragment>
  );
};
