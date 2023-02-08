import React, { forwardRef } from "react";
import { useParallax } from "react-scroll-parallax";

import { SplitContainer } from "@integritymarketing/ui-container-components";

import styles from "./styles.module.scss";

import Devices from "components/Devices";

const SplitContentTrailingImageSection = forwardRef(
  ({ children, className = "" }, ref) => {
    const parallax = useParallax({
      speed: -20,
    });

    return (
      <section
        className={`${className} ${styles.splitContentTrailingImageSection}`}
        ref={ref}
      >
        <SplitContainer className={styles.splitContainer}>
          <div className={styles.container}>{children}</div>

          <Devices className={styles.devices} ref={parallax.ref} />
        </SplitContainer>
      </section>
    );
  }
);

export default SplitContentTrailingImageSection;
