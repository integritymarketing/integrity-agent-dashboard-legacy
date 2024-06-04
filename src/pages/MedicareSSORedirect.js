import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const MedicareSSORedirect = () => {
    const { loginWithRedirect } = useAuth0();

    useEffect(() => {
        loginWithRedirect();
    }, [loginWithRedirect]);

    return (
        <Box className="content-frame v2" display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
        </Box>
    );
};

export default MedicareSSORedirect;