import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import image from "./image.svg";

import styles from "./styles.module.scss";
import HeaderWithLogin from "../HeaderWithLogin";
import * as Sentry from "@sentry/react";
import useFlashMessage from "../../hooks/useFlashMessage";
import { Redirect } from "react-router-dom";

const Header = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const { show: showMessage } = useFlashMessage();

  async function login() {
    try {
      await loginWithRedirect({
        redirectUri: window.location.origin + "/dashboard",
      });
    } catch (e) {
      Sentry.captureException(e);
      console.error("sign in error: ", e);
      showMessage("Unable to sign in at this time.", { type: "error" });
    }
  }

  if (isLoading) {
    return null;
  }
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <header className={styles.header}>
      <HeaderWithLogin image={image} onLogin={login} />
    </header>
  );
};

export default Header;
