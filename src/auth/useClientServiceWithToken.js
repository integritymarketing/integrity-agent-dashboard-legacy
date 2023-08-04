import { useEffect, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const useClientServiceWithToken = (ClientService) => {
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);

  const getAccessToken = useCallback(async () => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
        return accessToken;
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      return token;
    }
    return fetchToken();
  }, [getAccessTokenSilently, token]);

  const [clientService] = useState(new ClientService(getAccessToken));

  useEffect(() => {
    getAccessToken();
  }, [getAccessToken]);

  return clientService;
};

export default useClientServiceWithToken;
