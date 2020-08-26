import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default () => {
  const { pathname, hash = "#" } = useLocation();
  const formattedHash = hash.substr(1);

  useEffect(() => {
    if (formattedHash) {
      const el = document.getElementById(formattedHash);
      if (el) {
        el.scrollIntoView();
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, formattedHash]);

  return null;
};
