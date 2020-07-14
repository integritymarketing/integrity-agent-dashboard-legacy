import React, { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import AuthContext from "contexts/auth";

const LoginButton = (props) => {
  const history = useHistory();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const login = () => {
    const { from } = location.state || { from: { pathname: "/" } };
    auth.authenticate();
    history.replace(from);
  };

  return <button onClick={login} {...props}></button>;
};

export default () => {
  return (
    <React.Fragment>
      <div className="bg-brand text-invert">
        <GlobalNav />
      </div>
      <Container className="mt-scale-2">
        <div className="hdg hdg--3 mb-scale-1">Agent Login</div>
        <LoginButton className="btn">Login</LoginButton>
      </Container>
    </React.Fragment>
  );
};
