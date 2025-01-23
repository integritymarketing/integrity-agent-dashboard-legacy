import React, { forwardRef } from "react";

import { SplitContainer } from "@integritymarketing/ui-container-components";

import styles from "./styles.module.scss";

import Tablet from "components/Tablet";

const SplitContentTrailingTabletSection = forwardRef(
  ({ children, className = "" }, ref) => (
    <section
      className={`${className} ${styles.splitContentTrailingTabletSection}`}
      ref={ref}
    >
      <SplitContainer className={styles.splitContainer}>
        <div className={styles.container}>{children}</div>

        <Tablet className={styles.tablet} />
      </SplitContainer>
    </section>
  )
);

export default SplitContentTrailingTabletSection;
