import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import useQueryParams from "hooks/useQueryParams";
import authService from "services/authService";
import usePortalUrl from "hooks/usePortalUrl";

const ServerLogoutPage = () => {
  const params = useQueryParams();
  const portal_url = usePortalUrl();

  useEffect(() => {
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
        window.location = portal_url + "/signout-oidc";
      }
    };

    handleLogout();
  }, [params, portal_url]);

  return "";
};

export default ServerLogoutPage;
