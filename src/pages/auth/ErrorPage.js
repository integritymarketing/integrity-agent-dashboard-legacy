import React, { useEffect } from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";

const fetchError = async () => {
  const query = window.location.search;
  const errorIdQuery =
    query && query.toLowerCase().indexOf("?errorid=") === 0 && query;

  let response = await fetch(
    process.env.REACT_APP_AUTH_AUTHORITY_URL + "/error" + errorIdQuery
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
