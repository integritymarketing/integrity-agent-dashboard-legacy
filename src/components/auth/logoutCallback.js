import React from "react";
import AuthContext from "contexts/auth";

export default () => (
  <AuthContext.Consumer>
    {({ signoutRedirectCallback }) => {
      signoutRedirectCallback();
      return <span>loading</span>;
    }}
  </AuthContext.Consumer>
);
