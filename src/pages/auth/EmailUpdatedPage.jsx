import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";

const EmailUpdatePage = () => {
  return (
    <BaseConfirmationPage
      title="You’re all set"
      body="The email address for your account has been updated."
    />
  );
};

export default EmailUpdatePage;
