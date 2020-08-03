import React from "react";
import BaseConfirmationPage from "pages/admin/BaseConfirmationPage";

const fetchError = () => {
  const query = window.location.search;
  const errorIdQuery =
    query && query.toLowerCase().indexOf("?errorid=") === 0 && query;

  fetch(`${process.env.REACT_APP_AUTH_API_ERROR_URL}` + errorIdQuery, {
    credentials: "include",
  })
    .then((response) => {
      console.log(response.json());
      // return response.text();
    })
    .catch((err) => {
      console.error(err);
      return "";
    });
};

export default () => {
  fetchError();

  return (
    <BaseConfirmationPage title="We’re sorry" body={`An error occurred`} />
  );
};
