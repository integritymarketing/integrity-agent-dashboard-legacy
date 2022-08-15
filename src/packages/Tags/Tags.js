import * as React from "react";
import { Typography } from "@mui/material";
import styles from "./Tags.module.scss";

export default function Tags({ words, flexDirection = "row" }) {
  return (
    <div
      className={styles.tagsContainer}
      style={{ flexDirection: flexDirection }}
    >
      <Typography variant="subtitle1" sx={{ mx: 1 }}>
        Tags:
      </Typography>
      <div className={styles.tagsContainer}>
        {words &&
          words.length > 0 &&
          words.map((word, i) => (
            <div key={`${word}-${i}`} className={styles.tags}>
              <Typography variant="subtitle2" sx={{ mx: 1 }}>
                {word}
              </Typography>
            </div>
          ))}
      </div>
    </div>
  );
}
