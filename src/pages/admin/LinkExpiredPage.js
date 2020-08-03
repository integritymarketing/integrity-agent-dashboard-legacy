import React from "react";
import { Link } from "react-router-dom";
import BaseConfirmationPage from "pages/admin/BaseConfirmationPage";

export default () => {
  // TODO: re-send email and redirect user
  return (
    <BaseConfirmationPage
      footer={
        <div className="text-center text-body">
          <Link to="/register" className="link">
            Want to try a different email address?
          </Link>
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
