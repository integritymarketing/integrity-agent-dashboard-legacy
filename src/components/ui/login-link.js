import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import * as Sentry from "@sentry/react";
import useFlashMessage from "hooks/useFlashMessage";

const LoginButton = ({ ...otherProps }) => {
  const { loginWithRedirect } = useAuth0();
  const { show: showMessage } = useFlashMessage();

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        redirectUri: `${window.location.origin}/dashboard`,
      });
    } catch (error) {
      Sentry.captureException(error);
      showMessage("Unable to sign in at this time.", { type: "error" });
    }
  };

  return <button type="button" onClick={handleLogin} {...otherProps}></button>;
};

export default LoginButton;
