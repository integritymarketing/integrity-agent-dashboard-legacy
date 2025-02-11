import React from "react";
import Icon from "components/Icon";

import image from "./image.svg";

const InterfaceIcon = ({ className = "" }) => (
  <Icon altText="Interface Icon" className={className} image={image} />
);

export default InterfaceIcon;
