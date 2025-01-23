import React from "react";
import Icon from "components/Icon";

import image from "./image.svg";

const QuoteIcon = ({ className = "" }) => (
  <Icon altText="Quote Icon" className={className} image={image} />
);

export default QuoteIcon;
