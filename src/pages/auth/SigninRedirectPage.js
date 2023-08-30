import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import AuthContext from "contexts/auth";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import Heading1 from "packages/Heading1";

const LoginLink = (props) => {
  const auth = useContext(AuthContext);

  const login = () => {
    auth.signinRedirect();
  };

  return (
    <>
      <div className="text-body text-body--large mb-3">
        Unable to login automatically.
      </div>
      <button onClick={login} {...props}></button>
    </>
  );
};

const SigninRedirectPage = () => {
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
    <Grid className="content-frame v2" direction={"column"} container>
      <HeaderUnAuthenticated />
      <ContainerUnAuthenticated>
        <Heading1 className="hdg hdg--2 mb-2" text="Agent Login" />
        {!error && (
          <p className="text-body mt-2">Attempting automatic login...</p>
        )}
        {error && <LoginLink className="btn-v2">Go to Login portal</LoginLink>}
      </ContainerUnAuthenticated>
      <FooterUnAuthenticated />
    </Grid>
  );
};

export default SigninRedirectPage;
