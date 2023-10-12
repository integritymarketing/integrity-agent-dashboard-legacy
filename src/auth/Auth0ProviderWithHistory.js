import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { createBrowserHistory } from "history";

/**
 * Auth0ProviderWithHistory component wraps the Auth0Provider from @auth0/auth0-react
 * and provides additional configuration for handling redirects and authorization parameters.
 *
 * @component
 * @param {React.ReactNode} children - The child components to render.
 * @returns {React.ReactNode} The wrapped Auth0Provider component.
 * @see {@link https://auth0.github.io/auth0-react/interfaces/Auth0ProviderOptions.html}
 *    For a full list of the available properties on the provider.
 */

const Auth0ProviderWithHistory = ({ children }) => {
  const history = createBrowserHistory();
  const onRedirectCallback = (appState) => {
    navigate(
      appState && appState.returnTo
        ? appState.returnTo
        : window.location.pathname
    );
  };

  const providerConfig = {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
    onRedirectCallback,
    authorizationParams: {
      redirect_uri: window.location.origin,
      ...(process.env.REACT_APP_AUTH0_AUDIENCE
        ? { audience: process.env.REACT_APP_AUTH0_AUDIENCE }
        : null),
    },
    cacheLocation:"localstorage" // Configure the storage location
  };

  return <Auth0Provider {...providerConfig}>
      {children}
  </Auth0Provider>;
};

export default Auth0ProviderWithHistory;
