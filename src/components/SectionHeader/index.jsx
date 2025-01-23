import React, { forwardRef } from "react";
import { useInView } from "react-intersection-observer";

import { ContentContainer } from "@integritymarketing/ui-container-components";
import { SectionTitle, Text } from "@integritymarketing/ui-text-components";

import styles from "./styles.module.scss";

const SectionHeader = forwardRef(({ className = "", text, title }, ref) => {
  const { ref: sectionTitleRef, inView: sectionTitleInView } = useInView({
    threshold: 0,
  });

  const { ref: textRef, inView: textInView } = useInView({
    threshold: 0,
  });

  return (
    <section className={`${className} ${styles.sectionHeader}`} ref={ref}>
      <ContentContainer>
        <div className={styles.container}>
          <SectionTitle
            className={`${sectionTitleInView ? styles.animate : ""} ${
              styles.sectionTitle
            }`}
            ref={sectionTitleRef}
            text={title}
          />

          <Text
            className={`${textInView ? styles.animate : ""} ${styles.text}`}
            ref={textRef}
            text={text}
          />
        </div>
      </ContentContainer>
    </section>
  );
});

export default SectionHeader;
