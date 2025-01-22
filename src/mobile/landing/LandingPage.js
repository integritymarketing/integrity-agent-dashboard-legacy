import { useAuth0 } from "@auth0/auth0-react";
import * as Sentry from "@sentry/react";
import { ActionButton } from "@integritymarketing/ui-button-components";
import useFlashMessage from "hooks/useFlashMessage";
import IntegrityLogo from "components/HeaderWithLogin/Integrity-logo";

import Styles from "./LandingPage.module.scss";

const LandingPage = () => {
    const { loginWithRedirect } = useAuth0();
    const { show: showMessage } = useFlashMessage();

    async function handleLogin() {
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

    return (
        <>
            {/* Header */}
            <div className={Styles.header}>
                <IntegrityLogo />
                <ActionButton className={Styles.loginButton} text="Login" onClick={handleLogin} />
            </div>
            {/* Hero */}
            <div className={Styles.hero}>
                <img src="/images/landingPage/Hero.png" alt="Hero" className={Styles.heroImage} />
                <p className={Styles.heading}>Helping agents reach their full potential</p>
                <span className={Styles.bodyText}>
                    Say hello to a powerful, easy-to-use system built to help you serve clients better, boost your
                    production and take control of your business.
                </span>
                <div className={Styles.getStarted}>
                    <ActionButton
                        text="Get Started"
                        onClick={() => {
                            window.open(`${import.meta.env.VITE_AUTH_BASE_URL}/register?client_id=AEPortal`);
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default LandingPage;
