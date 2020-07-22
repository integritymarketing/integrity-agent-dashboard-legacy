import React, { useContext } from "react";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import AuthContext from "contexts/auth";

const LoginButton = (props) => {
  const auth = useContext(AuthContext);

  const login = () => {
    auth.signinRedirect();
  };

  return <button onClick={login} {...props}></button>;
};

export default () => {
  return (
    <React.Fragment>
      <div className="bg-brand text-invert">
        <GlobalNav />
      </div>
      <Container>
        <div className="hdg hdg--3">Agent Login</div>
        <LoginButton className="btn">Login</LoginButton>
      </Container>
    </React.Fragment>
  );
};
