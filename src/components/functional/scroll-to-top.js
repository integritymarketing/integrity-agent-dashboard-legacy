import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ rootEl = document.documentElement }) => {
  const { pathname, hash = "#" } = useLocation();
  const formattedHash = hash.substr(1);

  useEffect(() => {
    const scrollToHash = formattedHash
      ? document.getElementById(formattedHash)
      : false;

    if (scrollToHash) {
      scrollToHash.scrollIntoView();
    } else {
      rootEl.scrollTop = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, formattedHash]);

  return null;
};

export default ScrollToTop;