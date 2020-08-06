import { useEffect } from "react";
import { useHistory } from "react-router-dom";

async function handleComfirmEmail() {
  const searchParams = new URLSearchParams(window.location.search);
  const body = {
    npn: searchParams.get("npn"),
    token: searchParams.get("token"),
  };
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
}

export default () => {
  const history = useHistory();

  useEffect(() => {
    async function confirmEmail() {
      let response = await handleComfirmEmail();
      if (response.status >= 200 && response.status < 300) {
        history.push("registration-complete");
      } else {
        // TODO log issue in sentry?
        history.push("link-expired");
      }
    }

    confirmEmail();
  }, [history]);

  return "";
};
