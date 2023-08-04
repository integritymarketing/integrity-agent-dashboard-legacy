import React, {useState, useEffect, useContext,createContext} from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Auth0TokenContext = createContext();

export const useAuth0Token = () => {
  const token = useContext(Auth0TokenContext);
  if (token === undefined) {
    // throw new Error("useAuth0Token must be used within a Auth0TokenProvider");
  }
  return token;
};

const Auth0TokenProvider = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0();

  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
      } catch (error) {
        console.error(error);
      }
    };

    fetchToken();
  }, [getAccessTokenSilently]);


  return <Auth0TokenContext.Provider token={token}>
    {token ? children : null}
  </Auth0TokenContext.Provider>;
};

export default Auth0TokenProvider;
