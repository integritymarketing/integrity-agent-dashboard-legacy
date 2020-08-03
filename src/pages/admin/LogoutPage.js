import React from "react";

async function logMeOut() {
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

  if (data.signOutIFrameUrl) {
    var iframe = document.createElement("iframe");
    iframe.width = 0;
    iframe.height = 0;
    iframe.class = "signout";
    iframe.src = data.signOutIFrameUrl;
    document.getElementById("logout_iframe").appendChild(iframe);
  }

  if (data.postLogoutRedirectUri) {
    window.location = data.postLogoutRedirectUri;
  } else {
    console.error("no logout redirect URL present!");
  }
}

export default () => {
  logMeOut();

  return <div id="logout_iframe"></div>;
};
