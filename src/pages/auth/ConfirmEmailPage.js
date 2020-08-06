import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";

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
  const [error, setError] = useState(false);

  useEffect(() => {
    async function confirmEmail() {
      let response = await handleComfirmEmail();
      if (response.status >= 200 && response.status < 300) {
        history.push("registration-complete");
      } else {
        let errorObj = await response.json();
        if (errorObj.npn) {
          setError(errorObj.npn);
        } else {
          setError("Please try again or contact support.");
        }
        throw Error(errorObj);
      }
    }

    confirmEmail();
  }, [history]);

  return (
    <React.Fragment>
      {error ? (
        <BaseConfirmationPage
          title="We're sorry, but something went wrong"
          body={error}
          button=""
        />
      ) : (
        ""
      )}
    </React.Fragment>
  );
};
