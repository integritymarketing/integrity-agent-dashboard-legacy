import React from "react";
import AuthContext from "contexts/auth";

export default () => (
  <AuthContext.Consumer>
    {({ signinRedirectCallback }) => {
      signinRedirectCallback();
      return "";
    }}
  </AuthContext.Consumer>
);
