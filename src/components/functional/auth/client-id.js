import { useEffect } from "react";
import Cookies from "universal-cookie";
import useQueryParams from "hooks/useQueryParams";

// The purpose of this component is to inform the common authentication form
// which client ID (and ultimately which application the auth originated from)

const ClientId = () => {
  const params = useQueryParams();

  let client_id;
  if (params.get("ReturnUrl")) {
    const url = new URL(params.get("ReturnUrl"));
    let urlSearchParams = new URLSearchParams(url.search);

    client_id = urlSearchParams.get("client_id");
  } else if (params.get("client_id")) {
    client_id = params.get("client_id");
  }

  useEffect(() => {
    const cookies = new Cookies();
    let session_client_id = cookies.get("client_id");

    // set a session cookie for the auth forms to use
    // to determine app context if not equal to existing
    if (client_id && client_id !== session_client_id) {
      cookies.set("client_id", client_id);
    }
  }, [client_id]);

  return null;
};

export default ClientId;
