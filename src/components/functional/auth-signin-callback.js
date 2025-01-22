import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "universal-cookie";

const useAuthSigninCallBack = () => {
    const { signinSilent } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        const cookies = new Cookies();
        const clientId = cookies.get("sunfire_client_id");

        if (clientId) {
            window.location.href = import.meta.env.VITE_SUNFIRE_SSO_URL;
            cookies.remove("sunfire_client_id");
            return;
        }

        signinSilent().catch((error) => {
            Sentry.captureException(error);
            navigate("/error?code=login_callback_error", { replace: true });
        });
    }, [signinSilent, navigate]);

    return "";
};

export default useAuthSigninCallBack;
