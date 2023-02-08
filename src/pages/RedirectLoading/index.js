import React from "react";
import styles from "./styles.module.scss";
import SpinnerIcon from "components/icons/spinner";
import { Box } from "@mui/material";
import Heading2 from "packages/Heading2";
import Heading4 from "packages/Heading4";

const HEADING = "You are being signed in.";
const SUB_HEADING = "Please wait while you are redirected.";

export default function RedirectLoadingPage() {
  return (
    <div className={styles.outerContainer}>
      <div className={styles.centerContainer}>
        <Box sx={{ py: "5px" }}>
          <Heading2 className={styles.redirectHeading} text={HEADING} />
        </Box>
        <Box sx={{ py: "5px" }}>
          <Heading4 text={SUB_HEADING} className={styles.redirectSubHeading} />
        </Box>
        <SpinnerIcon />
      </div>
    </div>
  );
}
