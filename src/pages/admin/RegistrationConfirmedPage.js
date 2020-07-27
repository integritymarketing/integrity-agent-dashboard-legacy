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
      body="Please follow the link sent to your email to complete the registration process."
    />
  );
};
