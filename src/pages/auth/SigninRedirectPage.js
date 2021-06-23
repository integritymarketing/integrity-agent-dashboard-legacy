import React, { useContext, useEffect, useState } from "react";
import Container from "components/ui/container";
import SimpleHeader from "partials/simple-header";
import SimpleFooter from "partials/simple-footer";
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
      <div className="content-frame v2">
        <SimpleHeader />
        <Container size="small">
          <h1 className="hdg hdg--2 mb-2">Agent Login</h1>

          {!error && (
            <p className="text-body mt-2">Attempting automatic login...</p>
          )}
          {error && (
            <LoginLink className="btn-v2">Go to Login portal</LoginLink>
          )}
        </Container>
        <SimpleFooter />
      </div>
    </React.Fragment>
  );
};
