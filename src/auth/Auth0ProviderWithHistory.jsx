import PropTypes from "prop-types";
import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Auth0ProviderWithHistory = ({ children }) => {
    const navigate = useNavigate();

    const onRedirectCallback = (appState) => {
        const redirectTo = sessionStorage.getItem("redirectTo") || appState?.returnTo || window.location.pathname;
        sessionStorage.removeItem("redirectTo"); // Clean up after redirection
        navigate(redirectTo);
    };

    const providerConfig = {
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        onRedirectCallback,
        authorizationParams: {
            redirect_uri: window.location.origin,
            ...(import.meta.env.VITE_AUTH0_AUDIENCE && { audience: import.meta.env.VITE_AUTH0_AUDIENCE }),
            scope: import.meta.env.VITE_AUTH_SCOPES,
        },
        cacheLocation: "localstorage",
    };

    return <Auth0Provider {...providerConfig}>{children}</Auth0Provider>;
};

Auth0ProviderWithHistory.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Auth0ProviderWithHistory;
