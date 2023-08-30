import React, { useContext } from "react";
import * as Sentry from "@sentry/react";
import AuthContext from "contexts/auth";
import useFlashMessage from "hooks/useFlashMessage";

const LoginLinks = (props) => {
  const auth = useContext(AuthContext);
  const { show: showMessage } = useFlashMessage();

  const login = async () => {
    try {
      await auth.signinRedirect();
    } catch (e) {
      Sentry.captureException(e);
      console.error("sign in error: ", e);
      showMessage("Unable to sign in at this time.", { type: "error" });
    }
  };

  return <button type="button" onClick={login} {...props}></button>;
};

export default LoginLinks;
