import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import ResendButtonWithModal from "partials/resend-email";

export default () => {
  return (
    <BaseConfirmationPage
      footer={<ResendButtonWithModal />}
      title="Thank you"
      body="Please follow the link sent to your email to complete the registration process."
    />
  );
};
