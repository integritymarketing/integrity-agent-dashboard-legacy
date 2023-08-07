import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { useAuth0 } from "@auth0/auth0-react";

const ServerLogoutPage = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout({logoutParams: { 
          returnTo: window.location.origin
        }
        });
      } catch (error) {
        console.error("Failed to log out:", error);
        Sentry.captureException("Auth Logout: failed to log out", {
          level: "error",
          extra: { error }
        });
      }
    };

    handleLogout();
  }, [logout]);

  return "";
};

export default ServerLogoutPage;
