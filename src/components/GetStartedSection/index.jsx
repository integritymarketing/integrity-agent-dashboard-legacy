import React, { forwardRef } from "react";
import { useInView } from "react-intersection-observer";

import { ActionButton } from "@integritymarketing/ui-button-components";
import { SectionTitle, Text } from "@integritymarketing/ui-text-components";

import ItemsContainer from "components/ItemsContainer";

import styles from "./styles.module.scss";

const GetStartedSection = forwardRef(({ className = "" }, ref) => {
    const { ref: sectionTitleRef, inView: sectionTitleInView } = useInView({
        threshold: 0,
    });

    return (
        <section className={`${className} ${styles.getStartedSection}`} ref={ref}>
            <SectionTitle
                className={`${sectionTitleInView ? styles.animate : ""} ${styles.sectionTitle}`}
                ref={sectionTitleRef}
                text="Easy to Get Started"
            />

            <Text
                className={styles.text}
                text="Ready to reach your full potential as an agent? Integrity helps you make it happen. It’s simple to learn and free to use. Discover all the amazing ways it can empower you."
            />

            <ItemsContainer className={styles.itemsContainer}>
                <ActionButton
                    text="Get Started"
                    onClick={() => {
                        window.open(`${import.meta.env.VITE_AUTH_BASE_URL}/register?client_id=AEPortal`);
                    }}
                />
            </ItemsContainer>
        </section>
    );
});

export default GetStartedSection;
