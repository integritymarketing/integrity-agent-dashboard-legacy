import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import useParams from "hooks/useParams";

export default () => {
  const params = useParams();

  let body = params.get("message") || "Something went wrong, please try again.";

  return <BaseConfirmationPage title="We’re sorry" body={body} />;
};
