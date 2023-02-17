import React from "react";
import Icon from "components/Icon";

import image from "./image.svg";

const NotepadIcon = ({ className = "" }) => (
  <Icon altText="Notepad Icon" className={className} image={image} />
);

export default NotepadIcon;
