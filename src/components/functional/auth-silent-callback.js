import { useEffect, useContext } from "react";
import AuthContext from "contexts/auth";

const useAuthSilentCallBack = () => {
  const auth = useContext(AuthContext);

  useEffect(() => {
    auth.signinSilentCallback();
  }, [auth]);

  return "";
};

export default useAuthSilentCallBack;
