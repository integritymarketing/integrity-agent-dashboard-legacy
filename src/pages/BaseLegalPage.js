import React from "react";
import Container from "components/ui/container";
import GlobalNavV2 from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";

export default ({ children, title, ...props }) => {
  return (
    <div className="content-frame" {...props}>
      <div className="bg-photo text-invert">
        <GlobalNavV2 />
        <Container id="main-content" className="scaling-header">
          <h2 className="hdg hdg--2">{title}</h2>
        </Container>
      </div>
      <div className="v2">
        <div
          className="bg-white"
          data-gtm="learning-center-recommended-read-wrapper"
        >
          <Container className="pt-scale-3 pb-scale-4">{children}</Container>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};
