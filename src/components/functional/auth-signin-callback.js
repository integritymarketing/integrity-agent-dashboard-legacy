import { useEffect, useContext } from "react";
import AuthContext from "contexts/auth";

export default () => {
  const auth = useContext(AuthContext);

  useEffect(() => {
    auth.signinRedirectCallback();
  }, [auth]);

  return "";
};
