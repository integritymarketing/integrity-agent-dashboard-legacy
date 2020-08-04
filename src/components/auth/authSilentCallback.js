import React from "react";
import AuthContext from "contexts/auth";

export default () => (
  <AuthContext.Consumer>
    {({ signinSilentCallback }) => {
      signinSilentCallback();
      return "";
    }}
  </AuthContext.Consumer>
);
