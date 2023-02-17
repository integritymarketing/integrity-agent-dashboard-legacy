import React from "react";
import Icon from "components/Icon";

import image from "./image.svg";

const MobileIcon = ({ className = "" }) => (
  <Icon altText="Mobile Icon" className={className} image={image} />
);

export default MobileIcon;
