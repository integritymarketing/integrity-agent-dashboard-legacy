import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import analyticsService from "services/analyticsService";

const TrackPageviews = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    analyticsService.fireEvent("pageChange", {
      pageUrl: window.location.href,
      pagePath: pathname,
    });
  }, [pathname]);

  return null;
};

export default TrackPageviews;
