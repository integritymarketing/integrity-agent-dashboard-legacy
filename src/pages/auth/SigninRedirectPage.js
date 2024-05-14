import { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useAuth0 } from "@auth0/auth0-react";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import Heading1 from "packages/Heading1";

const LoginLink = (props) => {
    const { loginWithRedirect } = useAuth0();

    const login = () => {
        loginWithRedirect({
            authorizationParams: {
                redirect_uri: `${window.location.origin}/dashboard`,
            },
        });
    };

    return (
        <>
            <div className="text-body text-body--large mb-3">Unable to login automatically.</div>
            <button onClick={login} {...props}></button>
        </>
    );
};

const SigninRedirectPage = () => {
    const { loginWithRedirect } = useAuth0();
    const [error, setError] = useState(false);

    useEffect(() => {
        loginWithRedirect({
            authorizationParams: {
                redirect_uri: `${window.location.origin}/dashboard`,
            },
        });

        // if there is an issue w/ automatic redirect, render backup fragment
        // with button to allow user to manually start flow
        setTimeout(function () {
            setError(true);
        }, 3000);
    }, [loginWithRedirect]);

    return (
        <Grid className="content-frame v2" direction={"column"} container>
            <HeaderUnAuthenticated />
            <ContainerUnAuthenticated>
                <Heading1 className="hdg hdg--2 mb-2" text="Agent Login" />
                {!error && <p className="text-body mt-2">Attempting automatic login...</p>}
                {error && <LoginLink className="btn-v2">Go to Login portal</LoginLink>}
            </ContainerUnAuthenticated>
            <FooterUnAuthenticated />
        </Grid>
    );
};

export default SigninRedirectPage;
