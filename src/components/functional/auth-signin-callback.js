import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "contexts/auth";
import useQueryParams from "hooks/useQueryParams";

export default () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const params = useQueryParams();

  useEffect(() => {
    const params1 = new URLSearchParams(
      new URL(params.get("ReturnUrl")).search
    );
    let clientId = params1.get("client_id");
    if (clientId === "AgentMobileSunfire") {
      window.location.href =
        "https://qa-sunfire.sunfirematrix.com/api/partner/sso/int";
      return;
    }
    auth.signinSilent().catch((error) => {
      history.replace("/error?code=login_callback_error");
    });
  }, [auth, history, params]);

  return "";
};
