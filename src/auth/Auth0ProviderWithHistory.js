import PropTypes from "prop-types";
import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Auth0ProviderWithHistory = ({ children }) => {
    const navigate = useNavigate();

    const onRedirectCallback = (appState) => {
        navigate(appState?.returnTo || window.location.pathname);
    };

    const providerConfig = {
        domain: process.env.REACT_APP_AUTH0_DOMAIN,
        clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
        onRedirectCallback,
        authorizationParams: {
            redirect_uri: window.location.origin,
            ...(process.env.REACT_APP_AUTH0_AUDIENCE && { audience: process.env.REACT_APP_AUTH0_AUDIENCE }),
            scope: process.env.REACT_APP_AUTH_SCOPES,
        },
        cacheLocation: "localstorage",
    };

    return <Auth0Provider {...providerConfig}>{children}</Auth0Provider>;
};

Auth0ProviderWithHistory.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Auth0ProviderWithHistory;
