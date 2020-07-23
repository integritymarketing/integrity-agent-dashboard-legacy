import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "contexts/auth";

export default ({ children, ...rest }) => {
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
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
