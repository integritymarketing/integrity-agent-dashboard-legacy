import { Link } from "react-router-dom";
import PropTypes from "prop-types";
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

HeaderWithLogin.propTypes = {
    className: PropTypes.string,
    onLogin: PropTypes.func.isRequired,
};

export default HeaderWithLogin;
