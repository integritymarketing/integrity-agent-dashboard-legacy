import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "contexts/auth";

export default () => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {    
     auth.signinSilent().catch((error) => {
       history.replace("/error?code=login_callback_error");
     });
  }, [auth, history]);

  return "";
};
