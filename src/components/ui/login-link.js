import * as Sentry from "@sentry/react";
import { useAuth0 } from "@auth0/auth0-react";
import useFlashMessage from "hooks/useFlashMessage";

const LoginLinks = (props) => {
    const { loginWithRedirect } = useAuth0();
    const { show: showMessage } = useFlashMessage();

    const login = async () => {
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
    };

    return <button type="button" onClick={login} {...props}></button>;
};

export default LoginLinks;
