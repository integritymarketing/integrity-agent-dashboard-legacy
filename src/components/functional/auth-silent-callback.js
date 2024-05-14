import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const useAuthSilentCallBack = () => {
    const { isLoading, isAuthenticated, signinSilent } = useAuth0();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            signinSilent();
        }
    }, [isLoading, isAuthenticated, signinSilent]);

    return "";
};

export default useAuthSilentCallBack;
