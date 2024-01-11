import React from "react";
import { Link } from "react-router-dom";

import { ActionButton } from "@integritymarketing/ui-button-components";
import { Text } from "@integritymarketing/ui-text-components";

import IntegrityLogo from "./Integrity-logo";
import styles from "./styles.module.scss";

const HeaderWithLogin = ({ className = "", onLogin }) => (
    <header className={`${className} ${styles.headerWithLogin}`} data-gtm="headerWithLogin">
        <IntegrityLogo />
        {false && (
            <>
                <Text className={styles.faqLink} text="FAQ" />

                <Link to={"/help"}>
                    <Text className={styles.helpLink} text="Need Help?" />
                </Link>
            </>
        )}

        <ActionButton className={styles.actionButton} text="Login" onClick={onLogin} />
    </header>
);

export default HeaderWithLogin;
