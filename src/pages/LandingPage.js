import React, { useContext, useEffect, useState } from "react";
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
  const auth = useContext(AuthContext);
  const [error, setError] = useState(false);

  useEffect(() => {
    // auth.signinRedirect();

    // if there is an issue w/ automatic redirect, render backup fragment
    // with button to allow user to manually start flow
    setTimeout(function () {
      setError(true);
    }, 3000);
  }, [auth]);

  return (
    <React.Fragment>
      <div className="bg-photo text-invert">
        <GlobalNav />
        <Container className="scaling-header">
          <div className="hdg hdg--2">Agent Login</div>

          <div className="hdg hdg--3 mt-1">Login to view your account.</div>
        </Container>
      </div>
      <Container className="mt-scale-3">
        {!error && <p className="text-body">Attempting automatic login...</p>}
        {error && <LoginButton className="btn">Login</LoginButton>}
      </Container>
    </React.Fragment>
  );
};
