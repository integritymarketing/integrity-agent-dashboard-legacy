import React, { useEffect } from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";

const fetchError = async () => {
  let searchParams = new URLSearchParams(window.location.search);
  let response = await fetch(
    process.env.REACT_APP_AUTH_AUTHORITY_URL +
      "/error?errorId=" +
      searchParams.get("errorId")
  );
  return response.text();
};

export default () => {
  useEffect(() => {
    fetchError().then((error) => {
      throw Error(error);
    }, []);
  });
  return (
    <BaseConfirmationPage
      title="We’re sorry"
      body="An internal server error occurred.  We are looking into the problem, please try again later."
      button=""
    />
  );
};
