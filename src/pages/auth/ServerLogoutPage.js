import { useEffect } from "react";
import useParams from "hooks/useParams";

export default () => {
  useEffect(() => {
    const params = useParams();
    const handleLogout = async () => {
      let response = await fetch(
        process.env.REACT_APP_AUTH_AUTHORITY_URL +
          "/api/account/logout?logoutId=" +
          params.get("logoutId"),
        { credentials: "include" }
      );

      const data = await response.json();

      if (data.postLogoutRedirectUri) {
        window.location = data.postLogoutRedirectUri;
      } else {
        throw new Error("no logout redirect URL present in logout routine.");
      }
    };

    handleLogout();
  }, []);
  return "";
};
