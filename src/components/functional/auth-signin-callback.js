import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "contexts/auth";
import useQueryParams from "hooks/useQueryParams";

export default () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const params = useQueryParams();

  useEffect(() => {
    const clientId = sessionStorage.getItem('__clientId__');
    console.log('window.location.search clientId', clientId);
    console.log(' process.env.AGENT_MOBILE_SUNFIRE_URL',  process.env.AGENT_MOBILE_SUNFIRE_URL);
    if (clientId) {
      console.log('sessionStorage redirecting');
      window.location.href =
      process.env.AGENT_MOBILE_SUNFIRE_URL;
      return;
    }
    auth.signinSilent().catch((error) => {
      history.replace("/error?code=login_callback_error");
    });
  }, [auth, history, params]);

  return "";
};
