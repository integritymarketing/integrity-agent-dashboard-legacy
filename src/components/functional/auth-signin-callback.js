import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "contexts/auth";
import Cookies from "universal-cookie";

export default () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const cookies = new Cookies();

  useEffect(() => {
    const clientId = cookies.get("sunfire_client_id");
    if (clientId) {
      window.location.href = process.env.REACT_APP_SUNFIRE_SSO_URL;
      cookies.remove("sunfire_client_id");
      return;
    }
    auth.signinSilent().catch((error) => {
      history.replace("/error?code=login_callback_error");
    });
  }, [auth, history, cookies]);

  return "";
};
