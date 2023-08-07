import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import TrackPageviews from "components/functional/track-pageviews";
import ScrollToTop from "components/functional/scroll-to-top";
import { FlashProvider } from "contexts/flash";
import FlashMessage from "partials/flash-message";

const AppRouter = ({ children, ...props }) => (
  <Router {...props}>
    <TrackPageviews />
    <ScrollToTop />
    <FlashProvider>
      <FlashMessage />
      {children}
    </FlashProvider>
  </Router>
);

export default AppRouter;
