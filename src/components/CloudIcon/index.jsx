import React from "react";
import Icon from "components/Icon";

import image from "./image.svg";

const CloudIcon = ({ className = "" }) => (
  <Icon altText="Cloud Icon" className={className} image={image} />
);

export default CloudIcon;
