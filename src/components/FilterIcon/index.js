import React from "react";
import Icon from "components/Icon";

import image from "./image.svg";

const FilterIcon = ({ className = "" }) => (
  <Icon altText="Filter Icon" className={className} image={image} />
);

export default FilterIcon;
