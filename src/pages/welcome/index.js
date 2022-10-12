import { ActionButton } from '@integritymarketing/ui-button-components';
import {
    ImpactText,
    SectionTitle
} from '@integritymarketing/ui-text-components';

import React from "react";
import BoostProductionSection from 'components/BoostProductionSection';
import GetStartedSection from 'components/GetStartedSection';
import ItemsContainer from 'components/ItemsContainer';
import ServeClientsBetterSection from 'components/ServeClientsBetterSection';
import SmartSecureSection from 'components/SmartSecureSection';
import SplitContentImageSection from 'components/SplitContentImageSection';
import TakeControlSection from 'components/TakeControlSection';
import TestimonialSection from 'components/TestimonialSection';
import VideoSection from 'components/VideoSection';

import useConstants from './constants';

import styles from './styles.module.scss';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Welcome = () => {
    const { HERO_TEXT, HERO_TITLE } = useConstants();

    return (
        <>
            <Header />
            <SplitContentImageSection>
                <div className={styles.layout}>
                    <SectionTitle
                        className={styles.sectionTitle}
                        text={HERO_TITLE}
                    />

                    <ImpactText
                        className={styles.impactText}
                        text={HERO_TEXT}
                    />

                    <ItemsContainer>
                        <ActionButton text="Get Started" onClick={()=> {window.open(`${process.env.REACT_APP_AUTH_BASE_URL}/register?client_id=AEPortal`)}} />
                    </ItemsContainer>
                </div>
            </SplitContentImageSection>

            <VideoSection />

            <ServeClientsBetterSection
                className={styles.serveClientsBetterSection}
            />

            <BoostProductionSection />

            <TakeControlSection />

            <TestimonialSection />

            <SmartSecureSection />

            <GetStartedSection />
            <Footer />
        </>
    );
};

export default Welcome;
