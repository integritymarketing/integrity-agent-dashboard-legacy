import React from "react";

import { ActionButton } from "@integritymarketing/ui-button-components";
import { Text } from "@integritymarketing/ui-text-components";

import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import BrandLogo from "./brand-logo";

const HeaderWithLogin = ({ className = "", onLogin }) => (
    <header className={`${className} ${styles.headerWithLogin}`} data-gtm="headerWithLogin">
        <BrandLogo />
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
