import Cookies from "universal-cookie";
import useClientId from "hooks/auth/useClientId";

const usePortalUrl = () => {
  const cookies = new Cookies();
  const clientId = useClientId();

  if (clientId === "ILSClient" && cookies.get("client_url")) {
    return cookies.get("client_url");
  } else {
    // original logic
    return (
      process.env.REACT_APP_PORTAL_URL ||
      cookies.get("portal_url") ||
      cookies.get("client_url") ||
      "https://www.clients.integrity.com" // last resort fallback if cookie is removed in auth app.
    );
  }
};

export default usePortalUrl;
