import React from "react";
import Icon from "components/Icon";

import image from "./image.png";

const BookIcon = ({ className = "" }) => (
  <Icon altText="Book Icon" className={className} image={image} />
);

export default BookIcon;
