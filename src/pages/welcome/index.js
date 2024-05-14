import { ActionButton } from "@integritymarketing/ui-button-components";
import { ImpactText, SectionTitle } from "@integritymarketing/ui-text-components";

import ItemsContainer from "components/ItemsContainer";

import SplitContentImageSection from "components/SplitContentImageSection";

import useConstants from "./constants";

import styles from "./styles.module.scss";
import Header from "../../components/Header";

const Welcome = () => {
    const { HERO_TEXT, HERO_TITLE } = useConstants();

    return (
        <div className={styles.mainLayout}>
            <Header />
            <SplitContentImageSection>
                <div className={styles.layout}>
                    <SectionTitle className={styles.sectionTitle} text={HERO_TITLE} />

                    <ImpactText className={styles.impactText} text={HERO_TEXT} />

                    <ItemsContainer>
                        <ActionButton
                            text="Get Started"
                            onClick={() => {
                                window.open(`${process.env.REACT_APP_AUTH_REGISTRATION_URL}`);
                            }}
                        />
                    </ItemsContainer>
                </div>
            </SplitContentImageSection>
        </div>
    );
};

export default Welcome;
