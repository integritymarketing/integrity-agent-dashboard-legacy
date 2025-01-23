import React from "react";
import Icon from "components/Icon";

import image from "./image.png";

const DoorIcon = ({ className = "" }) => (
  <Icon altText="Door Icon" className={className} image={image} />
);

export default DoorIcon;
