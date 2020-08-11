import React, { useEffect } from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";
import useParams from "hooks/useParams";

export default () => {
  const params = useParams();

  const fetchError = async () => {
    let response = await fetch(
      process.env.REACT_APP_AUTH_AUTHORITY_URL +
        "/error?errorId=" +
        params.get("errorId")
    );
    return response.text();
  };

  useEffect(() => {
    fetchError().then((error) => {
      throw new Error(error);
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
