import React, { useContext } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import AuthContext from "contexts/auth";

export const UnauthenticatedRoute = ({ children, ...rest }) => {
  const auth = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !auth.isAuthenticated() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export const AuthenticatedRoute = ({ children, ...rest }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  // if not authenticated, store the path the user originally requested
  // and later return them to after auth success and user loaded
  // see authService() line 19
  if (!auth.isAuthenticated()) {
    localStorage.setItem("redirectUri", location.pathname);
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isAuthenticated() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default { AuthenticatedRoute, UnauthenticatedRoute };
