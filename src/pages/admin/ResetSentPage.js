import React from "react";
import BaseConfirmationPage from "pages/admin/BaseConfirmationPage";

export default () => {
  return (
    <BaseConfirmationPage
      footer={
        <div className="text-center text-body">
          Didn’t receive an email?{" "}
          <button type="button" className="link">
            Resend now
          </button>
        </div>
      }
      title="Thank you"
      body="If there is an account associated with the email address entered we will send a link to reset your account password."
    />
  );
};
