import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export function UnauthenticatedRoute({ children, ...rest }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  return (
    <Route {...rest}>
      {!isAuthenticated ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: "/dashboard",
            state: { from: location },
          }}
        />
      )}
    </Route>
  );
}

export function AuthenticatedRoute({ children, ...rest }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    localStorage.setItem("redirectUri", location.pathname);
    return (
      <Redirect
        to={{
          pathname: "/",
          state: { from: location },
        }}
      />
    );
  }

  return <Route {...rest}>{children}</Route>;
}

export default { AuthenticatedRoute, UnauthenticatedRoute };
