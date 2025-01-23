import Heading3 from "../Heading3";
import React from "react";
import styles from "./styles.module.scss";
import { Divider } from "@mui/material";

const SectionHeader = ({ className = "", text, children }) => (
  <>
    <div className={`${styles.sectionHeader} ${className}`}>
      <Heading3 text={text} />
      {children}
    </div>
    <Divider />
  </>
);

export default SectionHeader;
