import React from "react";
import AuthContext from "contexts/auth";

export default () => (
  <AuthContext.Consumer>
    {({ logout }) => {
      logout();
      return <span>loading</span>;
    }}
  </AuthContext.Consumer>
);
