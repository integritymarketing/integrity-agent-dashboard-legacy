import { useEffect } from "react";
import Cookies from "universal-cookie";
const { parse } = require("tldts");

// The purpose of this component is to tell the common authentication form
// which portal the auth request came from when in the same domain.

export default () => {
  const cookies = new Cookies();

  useEffect(() => {
    let portal_url = cookies.get("portal_url");

    // set a session cookie for the auth forms to use to determine app context
    if (portal_url !== process.env.REACT_APP_PORTAL_URL) {
      let domain_parts = parse(process.env.REACT_APP_PORTAL_URL);
      cookies.set("portal_url", process.env.REACT_APP_PORTAL_URL, {
        domain: domain_parts.domain || domain_parts.hostname, // use the domain in deployed environments, or hostname if 'localhost'
      });
    }
  }, [cookies]);

  return null;
};
