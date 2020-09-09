import React, { useContext } from "react";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import AuthContext from "contexts/auth";

const LoginLink = (props) => {
  const auth = useContext(AuthContext);

  const login = () => {
    auth.signinRedirect();
  };

  return (
    <React.Fragment>
      <button onClick={login} {...props}></button>
    </React.Fragment>
  );
};

export default () => {
  return (
    <React.Fragment>
      <div className="bg-photo text-invert">
        <GlobalNav />
        <Container className="scaling-header">
          <div className="hdg hdg--2">Welcome</div>
        </Container>
      </div>
      <Container className="mt-scale-3">
        <LoginLink className="btn">Login</LoginLink>
      </Container>
    </React.Fragment>
  );
};
