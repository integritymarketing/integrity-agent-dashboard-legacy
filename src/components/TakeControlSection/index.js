import React from "react";

import { SectionTitle, Text } from "@integritymarketing/ui-text-components";

import DoorIcon from "components/DoorIcon";
import InterfaceIcon from "components/InterfaceIcon";
import LightbulbIcon from "components/LightbulbIcon";
import ListContainer from "components/ListContainer";
import SplitContentTrailingTabletSection from "components/SplitContentTrailingTabletSection";

import styles from "./styles.module.scss";

const items = [
    {
        icon: <DoorIcon />,
        text: `Access MedicareAPP, MedicareLINK, CSG APP and our CRM and Quoting and E-App system – Contact Management - with one username and password.`,
        title: "Universal Login",
    },
    {
        icon: <InterfaceIcon />,
        text: `Master comprehensive functions without a long learning curve. Take advantage of exclusive tips, guides, training, and resources in our LearningCENTER.`,
        title: "Easy-to-Use Interface",
    },
    {
        icon: <LightbulbIcon />,
        text: `Get valuable info and industry trends to help give you an edge.`,
        title: "Insights from CSG",
    },
];

const TakeControlSection = () => (
    <SplitContentTrailingTabletSection className={styles.takeControlSection}>
        <SectionTitle text="Take Control of Your Business" />

        <Text text="Integrity all-in-one platform puts you in command of your most important tasks, while providing key insights. How's that for intelligent?" />

        <ListContainer className={styles.listContainer} items={items} />
    </SplitContentTrailingTabletSection>
);

export default TakeControlSection;
