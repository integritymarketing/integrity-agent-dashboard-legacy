import { useEffect } from "react";
import { useHistory } from "react-router-dom";

async function handleComfirmEmail() {
  const history = useHistory();
  const searchParams = new URLSearchParams(window.location.search);
  const body = {
    npn: searchParams.get("npn"),
    token: searchParams.get("token"),
  };

  const response = await fetch(
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

  if (response.status >= 200 && response.status < 300) {
    history.push("/registration-complete");
  } else {
    // const data = await response.json();
    // handle 400 if password reset limit is reached?
  }
}

export default () => {
  useEffect(() => {
    handleComfirmEmail();
  }, []);
  return "";
};
