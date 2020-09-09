import React, { useContext, useEffect, useState } from "react";
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
      <div className="text-body text-body--large mb-3">
        Unable to login automatically.
      </div>
      <button onClick={login} {...props}></button>
    </React.Fragment>
  );
};

export default () => {
  const auth = useContext(AuthContext);
  const [error, setError] = useState(false);

  useEffect(() => {
    auth.signinRedirect();

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

          <div className="hdg hdg--4 mt-1">Login to view your account.</div>
        </Container>
      </div>
      <Container className="mt-scale-3">
        {!error && <p className="text-body">Attempting automatic login...</p>}
        {error && <LoginLink className="link">Go to Login portal</LoginLink>}
      </Container>
    </React.Fragment>
  );
};
