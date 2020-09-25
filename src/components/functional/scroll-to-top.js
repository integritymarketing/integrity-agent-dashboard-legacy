import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default ({ rootEl = document.documentElement }) => {
  const { pathname, hash = "#" } = useLocation();
  const formattedHash = hash.substr(1);

  useEffect(() => {
    if (formattedHash) {
      const el = document.getElementById(formattedHash);
      if (el) {
        el.scrollIntoView();
      }
    } else {
      rootEl.scrollTop = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, formattedHash]);

  return null;
};
