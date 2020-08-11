import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useParams from "hooks/useParams";

const bodyFor = (params) => {
  return {
    npn: params.get("npn"),
    token: params.get("token"),
  };
};

const handleComfirmEmail = async (body) => {
  return await fetch(
    process.env.REACT_APP_AUTH_AUTHORITY_URL + "/api/account/confirmemail",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    }
  );
};

export default () => {
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    const confirmEmail = async () => {
      let body = bodyFor(params);
      let response = await handleComfirmEmail(body);

      if (response.status >= 200 && response.status < 300) {
        history.push("registration-complete");
      } else {
        history.push(`confirm-link-expired?npn=${body.npn}`);
      }
    };

    confirmEmail();
  }, [history, params]);

  return "";
};
