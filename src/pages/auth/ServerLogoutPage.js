import { useEffect } from "react";
import useParams from "hooks/useParams";
import authService from "services/authService";

export default () => {
  useEffect(() => {
    const params = useParams();
    const handleLogout = async () => {
      const response = await authService.logoutUser(params.get("logoutId"));
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
