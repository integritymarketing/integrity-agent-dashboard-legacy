import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";

const redirectAndRestartLoginFlow = () => {
  window.location = process.env.REACT_APP_PORTAL_HOST_URL;
};

export default () => {
  return (
    <BaseConfirmationPage
      footer={
        <div className="text-center text-body">
          <button className="link" onClick={redirectAndRestartLoginFlow}>
            Want to try a different email address?
          </button>
        </div>
      }
      title="We’re sorry"
      body="The link you used has expired."
      button={
        <button type="button" className="btn">
          Resend Email
        </button>
      }
    />
  );
};
