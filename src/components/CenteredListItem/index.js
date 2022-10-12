import React, { forwardRef } from "react";

import { Heading, Text } from "@integritymarketing/ui-text-components";

import Icon from "components/Icon";

import styles from "./styles.module.scss";

const CenteredListItem = forwardRef(
  ({ className = "", icon, text, title }, ref) => (
    <div className={`${className} ${styles.centeredListItem}`} ref={ref}>
      {icon || <Icon />}

      <Heading className={styles.heading} text={title} />

      <Text text={text} />
    </div>
  )
);

export default CenteredListItem;
