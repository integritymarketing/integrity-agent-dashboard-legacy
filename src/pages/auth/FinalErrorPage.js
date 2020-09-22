import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import useQueryParams from "hooks/useQueryParams";

export default () => {
  const params = useQueryParams();

  let body = params.get("message") || "Something went wrong, please try again.";

  return <BaseConfirmationPage title="We’re sorry" body={body} />;
};
