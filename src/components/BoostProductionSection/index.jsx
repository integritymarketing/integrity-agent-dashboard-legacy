import React from "react";
import SectionHeader from "components/SectionHeader";
import SplitContentLeadingImageSection from "components/SplitContentLeadingImageSection";
import { ParallaxContainer } from "@integritymarketing/ui-container-components";

import ListContainer from "components/ListContainer";

import useConstants from "./constants";

import image from "./image.png";
import lead from "./images/lead.jpg";

import BookIcon from "components/BookIcon";
import CompareIcon from "components/CompareIcon";
import QuoteIcon from "components/QuoteIcon";

import styles from "./styles.module.scss";

const items = [
  {
    icon: <BookIcon />,
    text: `Choose when to have leads delivered right to your Contact Management profile.`,
    title: "Lead Management",
  },
  {
    icon: <CompareIcon />,
    text: `Quickly guide clients to the best available coverage options.`,
    title: "Side-by-Side Plan Comparison",
  },
  {
    icon: <QuoteIcon />,
    text: `Connect to the largest selection of MA and PDP plans straight from a client record in our CRM for easy e-apps.`,
    title: "Integrated Quoting and Enrollment",
  },
];

const BoostProductionSection = () => {
  const { CENTERED_TEXT, CENTERED_TITLE } = useConstants();

  return (
    <div className={styles.boostProductionSection}>
      <ParallaxContainer className={styles.parallaxContainer} image={image}>
        <SplitContentLeadingImageSection image={lead}>
          <SectionHeader
            className={styles.sectionHeader}
            text={CENTERED_TEXT}
            title={CENTERED_TITLE}
          />

          <ListContainer items={items} />
        </SplitContentLeadingImageSection>
      </ParallaxContainer>
    </div>
  );
};

export default BoostProductionSection;
