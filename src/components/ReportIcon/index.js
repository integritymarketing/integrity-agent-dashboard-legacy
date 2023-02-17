import React from "react";
import Icon from "components/Icon";

import image from "./image.svg";

const ReportIcon = ({ className = "" }) => (
  <Icon altText="Report Icon" className={className} image={image} />
);

export default ReportIcon;
