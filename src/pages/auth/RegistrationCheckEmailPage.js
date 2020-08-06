import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import ResendButtonWithModal from "partials/resend-email";

// maybe store upn in the client to avoid passing it around as param?
const getParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    npn: searchParams.get("npn"),
  };
};

const resendComfirmEmail = async (npn) => {
  return await fetch(
    process.env.REACT_APP_AUTH_AUTHORITY_URL +
      "/api/account/resendconfirmemail",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ npn: npn }),
    }
  );
};

export default () => {
  return (
    <BaseConfirmationPage
      footer={
        <ResendButtonWithModal
          resendFn={resendComfirmEmail}
          upn={getParams().upn}
        />
      }
      title="Thank you"
      body="Please follow the link sent to your email to complete the registration process."
    />
  );
};
