import React from "react";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";

async function handleLogout() {
  var query = window.location.search;
  var logoutIdQuery =
    query && query.toLowerCase().indexOf("?logoutid=") === 0 && query;

  const response = await fetch(
    process.env.REACT_APP_AUTH_API_LOGOUT_URL + logoutIdQuery,
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  if (data.postLogoutRedirectUri) {
    window.location = data.postLogoutRedirectUri;
  } else {
    console.error("no logout redirect URL present!");
  }
}

export default () => {
  handleLogout();

  return "";
};
