import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import useQueryParams from "hooks/useQueryParams";
import authService from "services/authService";

export default () => {
  useEffect(() => {
    const params = useQueryParams();
    const handleLogout = async () => {
      const response = await authService.logoutUser(params.get("logoutId"));
      const data = await response.json();

      if (data.postLogoutRedirectUri) {
        window.location = data.postLogoutRedirectUri;
      } else {
        Sentry.captureException(
          "Auth Logout: no logout redirect URL present in authService.logoutUser() API call. sending user to /signout-oidc",
          {
            level: "warning",
          }
        );
        window.location = process.env.REACT_APP_PORTAL_URL + "/signout-oidc";
      }
    };

    handleLogout();
  }, []);

  return "";
};
