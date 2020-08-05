import { useEffect } from "react";
// import { useHistory } from "react-router-dom";

async function handleComfirmEmail(history) {
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
    window.location("/registration-complete");
    // history.push("registration-complete");
  } else {
    console.log("bad request");
    // const data = await response.json();
    // handle 400 and show error?
  }
}

// how to useHistory w/ handleConfirmEmail inside useEffect
export default () => {
  useEffect(() => {
    handleComfirmEmail();
  }, []);

  return "";
};
