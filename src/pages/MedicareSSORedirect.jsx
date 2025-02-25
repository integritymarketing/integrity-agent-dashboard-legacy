import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const MedicareSSORedirect = () => {
    const { loginWithRedirect } = useAuth0();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/dashboard";

    useEffect(() => {
        // Store redirect path before login
        sessionStorage.setItem("redirectTo", redirectTo);

        loginWithRedirect({
            authorizationParams: {
                redirect_uri: `${window.location.origin}/dashboard`,
            },
        });
    }, [loginWithRedirect, redirectTo]);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
    );
};

export default MedicareSSORedirect;
