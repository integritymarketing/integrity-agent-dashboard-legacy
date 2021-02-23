import Cookies from "universal-cookie";

export default () => {
  const cookies = new Cookies();
  return (
    process.env.REACT_APP_PORTAL_URL ||
    cookies.get("portal_url") ||
    "https://www.medicarecenter.com" // last resort fallback if cookie is removed in auth app.
  );
};
