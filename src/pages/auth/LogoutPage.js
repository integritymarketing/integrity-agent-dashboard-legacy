async function handleLogout() {
  var query = window.location.search;
  var logoutIdQuery =
    query && query.toLowerCase().indexOf("?logoutid=") === 0 && query;

  const response = await fetch(
    process.env.REACT_APP_AUTH_AUTHORITY_URL +
      "/api/account/logout" +
      logoutIdQuery,
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  if (data.postLogoutRedirectUri) {
    window.location = data.postLogoutRedirectUri;
  } else {
    console.error("no logout redirect URL present.");
  }
}

export default () => {
  handleLogout();

  return "";
};
