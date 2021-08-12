import Cookies from "universal-cookie";

export default () => {
  const cookies = new Cookies();
  return (
    // client_url or medicarecenter.com as last resort fallback if cookie is not present in auth app
    cookies.get("client_url") || "https://www.medicarecenter.com" // last resort fallback if cookie is removed in auth app.
  );
};
