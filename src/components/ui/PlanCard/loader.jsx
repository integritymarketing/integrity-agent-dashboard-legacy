import React from "react";
import "./index.scss";
import ContentLoader from "react-content-loader";

const PlanCardLoader = (props) => (
  <div className={"plan-card loader"}>
    <ContentLoader
      speed={2}
      width={871}
      height={488}
      viewBox="0 0 871 488"
      backgroundColor="rgba(230, 236, 242, .59)"
      foregroundColor="rgba(225, 233, 241, .97)"
      animate={true}
      {...props}
    >
      <rect x="0" y="0" rx="3" ry="3" width="615" height="31" />
      <rect x="0" y="36" rx="3" ry="3" width="196" height="21" />
      <rect x="638" y="7" rx="3" ry="3" width="168" height="19" />
      <rect x="0" y="68" rx="0" ry="0" width="804" height="270" />
      <rect x="0" y="360" rx="0" ry="0" width="804" height="60" />
      <rect x="700" y="440" rx="0" ry="0" width="107" height="62" />
      <rect x="590" y="440" rx="0" ry="0" width="107" height="62" />
    </ContentLoader>
  </div>
);

export default PlanCardLoader;
