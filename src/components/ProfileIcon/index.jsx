import React from "react";
import Icon from "components/Icon";

import image from "./image.svg";

const ProfileIcon = ({ className = "" }) => (
  <Icon altText="Profile Icon" className={className} image={image} />
);

export default ProfileIcon;
