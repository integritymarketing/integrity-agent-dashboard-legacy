import React from "react";

import { ActionButton } from "@integritymarketing/ui-button-components";
import { Text } from "@integritymarketing/ui-text-components";

import Logo from "components/Logo";

import styles from "./styles.module.scss";
import { Link } from "react-router-dom";

const HeaderWithLogin = ({ className = "", image, onLogin }) => (
  <header
    className={`${className} ${styles.headerWithLogin}`}
    data-gtm="headerWithLogin"
  >
    <Logo className={styles.logo} image={image} />

    {false && (
      <>
        <Text className={styles.faqLink} text="FAQ" />

        <Link to={"/help"}>
          <Text className={styles.helpLink} text="Need Help?" />
        </Link>
      </>
    )}

    <ActionButton
      className={styles.actionButton}
      text="Login"
      onClick={onLogin}
    />
  </header>
);

export default HeaderWithLogin;
