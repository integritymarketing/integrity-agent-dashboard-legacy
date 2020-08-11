import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const getParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    npn: searchParams.get("npn"),
    token: searchParams.get("token"),
  };
};

const handleComfirmEmail = async () => {
  const body = getParams();
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

  useEffect(() => {
    const confirmEmail = async () => {
      let response = await handleComfirmEmail();

      if (response.status >= 200 && response.status < 300) {
        history.push("registration-complete");
      } else {
        history.push(`link-expired?npn=${getParams().npn}`);
      }
    };

    confirmEmail();
  }, [history]);

  return "";
};
