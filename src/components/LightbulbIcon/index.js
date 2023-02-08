import React from "react";
import Icon from "components/Icon";

import image from "./image.svg";

const LightbulbIcon = ({ className = "" }) => (
  <Icon altText="Lightbulb Icon" className={className} image={image} />
);

export default LightbulbIcon;
