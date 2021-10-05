import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "contexts/auth";

export default () => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    auth
      .signinRedirectCallback()
      .catch((error) => {
        history.replace("/error?code=login_callback_error");
      })
      .then(() => {
        const redirectUrl = localStorage.getItem("redirectUri");
        if (redirectUrl) {
          setTimeout(() => {
            history.replace(redirectUrl);
            localStorage.removeItem("redirectUri");
          }, 1000);          
        }
      });
  }, [auth, history]);

  return "";
};
