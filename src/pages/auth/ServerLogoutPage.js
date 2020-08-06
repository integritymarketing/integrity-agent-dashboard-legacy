import { useEffect } from "react";

async function handleLogout() {
  let searchParams = new URLSearchParams(window.location.search);
  let response = await fetch(
    process.env.REACT_APP_AUTH_AUTHORITY_URL +
      "/api/account/logout?logoutId=" +
      searchParams.get("logoutId"),
    { credentials: "include" }
  );

  const data = await response.json();

  if (data.postLogoutRedirectUri) {
    window.location = data.postLogoutRedirectUri;
  } else {
    throw Error("no logout redirect URL present in logout routine.");
  }
}

export default () => {
  useEffect(() => {
    handleLogout();
  }, []);
  return "";
};
