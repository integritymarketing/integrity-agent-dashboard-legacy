import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import HeaderWithLogin from "../HeaderWithLogin";
import * as Sentry from "@sentry/react";
import useFlashMessage from "hooks/useFlashMessage";
import styles from "./styles.module.scss";

const Header = () => {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
    const { show: showMessage } = useFlashMessage();
    const navigate = useNavigate();

    async function login() {
        try {
            await loginWithRedirect({
                authorizationParams: {
                    redirect_uri: `${window.location.origin}/dashboard`,
                },
            });
        } catch (e) {
            Sentry.captureException(e);
            showMessage("Unable to sign in at this time.", { type: "error" });
        }
    }

    if (isLoading) {
        return null;
    }
    if (isAuthenticated) {
        navigate("/dashboard");
        return null;
    }

    return (
        <header className={styles.header}>
            <HeaderWithLogin
                onLogin={async () => {
                    await login();
                }}
            />
        </header>
    );
};

export default Header;
