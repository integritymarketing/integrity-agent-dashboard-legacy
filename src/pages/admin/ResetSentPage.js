import React from "react";
import BaseConfirmationPage from "pages/admin/BaseConfirmationPage";
import ResendButtonWithModal from "partials/resend-email";

export default () => {
  return (
    <BaseConfirmationPage
      footer={<ResendButtonWithModal />}
      title="Thank you"
      body="If there is an account associated with the email address entered we will send a link to reset your account password."
    />
  );
};
