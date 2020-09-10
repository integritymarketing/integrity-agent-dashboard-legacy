import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
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
              pathname: "/home",
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

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isAuthenticated() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/welcome",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default { AuthenticatedRoute, UnauthenticatedRoute };
