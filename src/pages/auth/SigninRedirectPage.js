import React, { useEffect, useState, useCallback } from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useAuth0 } from "@auth0/auth0-react";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import Heading1 from "packages/Heading1";

const LoginLink = (props) => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = useCallback(() => {
    loginWithRedirect({
      redirectUri: window.location.origin + "/dashboard",
    });
  }, [loginWithRedirect]);

  return (
    <>
      <div className="text-body text-body--large mb-3">
        Unable to login automatically.
      </div>
      <button onClick={handleLogin} {...props}></button>
    </>
  );
};

const SigninRedirectPage = () => {
  const { loginWithRedirect } = useAuth0();
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    loginWithRedirect({
      redirectUri: window.location.origin + "/dashboard",
    });

    const timer = setTimeout(() => {
      setLoginError(true);
    }, 3000);

    return () => clearTimeout(timer); 

  }, [loginWithRedirect]);

  return (
    <Grid className="content-frame v2" direction={"column"} container>
      <HeaderUnAuthenticated />
      <ContainerUnAuthenticated>
        <Heading1 className="hdg hdg--2 mb-2" text="Agent Login" />
        {!loginError && (
          <p className="text-body mt-2">Attempting automatic login...</p>
        )}
        {loginError && <LoginLink className="btn-v2">Go to Login portal</LoginLink>}
      </ContainerUnAuthenticated>
      <FooterUnAuthenticated />
    </Grid>
  );
};

export default SigninRedirectPage;
