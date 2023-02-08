import React from "react";
import { Link } from "@mui/material";
import styles from "./styles.module.scss";

const Hyperlink = ({ text, onClick }) => (
  <Link
    className={styles.hyperlink}
    variant="subtitle1"
    underline={"none"}
    onClick={(e) => {
      onClick(e);
    }}
  >
    {text}
  </Link>
);

export default Hyperlink;
