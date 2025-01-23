import { useEffect, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import * as Sentry from "@sentry/react";

const useClientServiceWithToken = (ClientService) => {
    const { getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState(null);

    const getAccessToken = useCallback(async () => {
        if (token) {
            return token;
        }

        try {
            const accessToken = await getAccessTokenSilently();
            setToken(accessToken);
            return accessToken;
        } catch (error) {
            Sentry.captureException(error);
            return null;
        }
    }, [getAccessTokenSilently, token]);

    const [clientService] = useState(() => new ClientService(getAccessToken));

    useEffect(() => {
        if (!token) {
            getAccessToken();
        }
    }, [getAccessToken, token]);

    return clientService;
};

export default useClientServiceWithToken;
