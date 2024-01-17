import React from "react";

import { ParallaxContainer } from "@integritymarketing/ui-container-components";
import { Heading, Text } from "@integritymarketing/ui-text-components";

import Carousel from "components/Carousel";
import SplitContentLeadingImageSection from "components/SplitContentLeadingImageSection";

import image from "./image.png";
import imageOfJustinKendter from "./images/justinKendter.png";
import quote from "./images/quotes.png";
import imageOfRobinGrimm from "./images/robinGrimm.png";
import styles from "./styles.module.scss";

const TestimonialSection = () => {
    return (
        <div className={styles.testimonialSection}>
            <ParallaxContainer className={styles.parallaxContainer} image={image}>
                <Carousel
                    items={[
                        <SplitContentLeadingImageSection image={imageOfJustinKendter}>
                            <img alt="quotes" className={styles.quotes} src={quote} />

                            <Heading text="Integrity has turned my business into my dream job! Being able to assist my clients while I'm anywhere in the world has been a game changer. With just a laptop & internet connection, I'm able to run my business from lead to client!" />

                            <span>
                                <Text text="Justin W. Kendter" />

                                <Text className={styles.companyName} text="K Insurance Solutions" />
                            </span>
                        </SplitContentLeadingImageSection>,

                        <SplitContentLeadingImageSection image={imageOfRobinGrimm}>
                            <img alt="quotes" className={styles.quotes} src={quote} />

                            <Heading text="Integrity has been life changing for our agency. It saves us time and money of no more faxing. We know when we finalize an application it will be error free and issued faster. We would not want be without it!" />

                            <span>
                                <Text text="Robin Grimm" />

                                <Text className={styles.companyName} text="RLG Financial Concepts" />
                            </span>
                        </SplitContentLeadingImageSection>,
                    ]}
                />
            </ParallaxContainer>
        </div>
    );
};

export default TestimonialSection;
