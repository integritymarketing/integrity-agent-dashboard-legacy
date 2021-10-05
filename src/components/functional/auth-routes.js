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

export const AuthenticatedRoute = ({
  children,
  requestAuth = false,
  ...rest
}) => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  if (requestAuth) {
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
