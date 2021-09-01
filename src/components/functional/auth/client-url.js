import { useEffect } from "react";
import Cookies from "universal-cookie";
import useQueryParams from "hooks/useQueryParams";
const { parse } = require("tldts");

// The purpose of this component is to inform the common authentication form
// which client URL the auth originated from
// client_url is primarily used when dealing w/ third party domains (and portal_url is not an option.)

export default () => {
  const cookies = new Cookies();
  const params = useQueryParams();

  let client_url;
  let redirect_uri;

  if (params.get("ReturnUrl")) {
    const url = new URL(params.get("ReturnUrl"));
    let urlSearchParams = new URLSearchParams(url.search);

    redirect_uri = urlSearchParams.get("redirect_uri");
  } else if (params.get("redirect_uri")) {
    redirect_uri = params.get("redirect_uri");
  } else if (params.get("client_url")) {
    redirect_uri = params.get("client_url");
  }

  let domain_parts = parse(redirect_uri);
  if (domain_parts && domain_parts.hostname) {
    client_url = "https://" + domain_parts?.hostname;
  }

  useEffect(() => {
    let session_client_url = cookies.get("client_url");

    // set a session cookie for the auth forms to track return url
    // from third-party domains
    if (client_url && client_url !== session_client_url) {
      cookies.set("client_url", client_url);
    }
  }, [cookies, client_url]);

  return null;
};
