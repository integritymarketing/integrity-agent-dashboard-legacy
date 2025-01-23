import React from "react";
import Icon from "components/Icon";

import image from "./image.png";

const CompareIcon = ({ className = "" }) => (
  <Icon altText="Compare Icon" className={className} image={image} />
);

export default CompareIcon;
