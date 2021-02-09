import Cookies from "universal-cookie";

export default () => {
  const cookies = new Cookies();
  return cookies.get("portal_url") || process.env.REACT_APP_PORTAL_URL;
};
