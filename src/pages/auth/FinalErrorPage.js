import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";

export default () => {
  let searchParams = new URLSearchParams(window.location.search);
  let body =
    searchParams.get("message") || "Something went wrong, please try again.";

  return <BaseConfirmationPage title="We’re sorry" body={body} />;
};
