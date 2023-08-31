import { useEffect, useContext } from "react";
import AuthContext from "contexts/auth";

const useAuthSignOutCallBack = () => {
  const auth = useContext(AuthContext);

  useEffect(() => {
    auth.signoutRedirectCallback();
  }, [auth]);

  return "";
};

export default useAuthSignOutCallBack;
