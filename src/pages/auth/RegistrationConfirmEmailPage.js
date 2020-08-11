import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useParams from "hooks/useParams";

export default () => {
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    const handleComfirmEmail = async () => {
      return await fetch(
        process.env.REACT_APP_AUTH_AUTHORITY_URL + "/api/account/confirmemail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            npn: params.get("npn"),
            token: params.get("token"),
          }),
        }
      );
    };

    const confirmEmail = async () => {
      let response = await handleComfirmEmail();

      if (response.status >= 200 && response.status < 300) {
        history.push("registration-complete");
      } else {
        history.push(`confirm-link-expired?npn=${params.get("npn")}`);
      }
    };

    confirmEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return "";
};
