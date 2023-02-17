import React, { useContext } from "react";

import image from "./image.svg";

import styles from "./styles.module.scss";
import HeaderWithLogin from "../HeaderWithLogin";
import * as Sentry from "@sentry/react";
import AuthContext from "../../contexts/auth";
import useFlashMessage from "../../hooks/useFlashMessage";

const Header = () => {
  const auth = useContext(AuthContext);
  const { show: showMessage } = useFlashMessage();

  async function login() {
    try {
      auth.signinRedirect();
    } catch (e) {
      Sentry.captureException(e);
      console.error("sign in error: ", e);
      showMessage("Unable to sign in at this time.", { type: "error" });
    }
  }
  return (
    <header className={styles.header}>
      <HeaderWithLogin
        image={image}
        onLogin={async () => {
          await login();
        }}
      />
    </header>
  );
};

export default Header;
