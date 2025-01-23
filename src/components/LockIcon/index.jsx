import React from "react";
import Icon from "components/Icon";

import image from "./image.svg";

const LockIcon = ({ className = "" }) => (
  <Icon altText="Lock Icon" className={className} image={image} />
);

export default LockIcon;
