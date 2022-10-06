import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "contexts/auth";

export default () => {
  const auth = useContext(AuthContext);
  const history = useHistory();  

  useEffect(() => {
    const clientId = sessionStorage.getItem('__clientId__');    
    if (clientId === "AgentMobileSunfire") {
      window.location.href =
        "https://qa-sunfire.sunfirematrix.com/api/partner/sso/int";
      return;
    }    
    auth.signinSilent().catch((error) => {
      history.replace("/error?code=login_callback_error");
    });
  }, [auth, history]);

  return "";
};
