import { useMemo } from "react";
import PropTypes from "prop-types";
import PlanCardLoader from "components/ui/PlanCard/loader";
import { ContactProfileTabBar } from "components/ContactDetailsContainer";
import { useLeadDetails } from "providers/ContactDetails";
import { LIFE_FORM_TITLE, LIFE_FORM_TYPES } from "components/LifeForms/LifeForm.constants";
import { ProductPreferenceForm } from "../ProductPreferenceForm";
import { LifeFormContainer } from "components/LifeForms/common/LifeFormContainer";
import { IulProtectionProductPreferenceForm } from "../IulProtectionProductPreferenceForm";

export const ProductPreferenceContainer = ({ contactId, quoteType }) => {
    const { isLoadingLeadDetails } = useLeadDetails();
    const renderContactDetailsLoader = useMemo(() => <PlanCardLoader />, []);

    return (
        <>
            <ContactProfileTabBar contactId={contactId} showTabs={false} backButtonLabel="Back" backButtonRoute="" />
            {isLoadingLeadDetails ? (
                renderContactDetailsLoader
            ) : (
                <>
                    {quoteType == LIFE_FORM_TYPES.IUL_ACCUMULATION || quoteType == LIFE_FORM_TYPES.IUL_PROTECTION ? (
                        <LifeFormContainer
                            cardHeaderTitle={LIFE_FORM_TITLE[quoteType].HEADER_TITLE}
                            cardTitle={LIFE_FORM_TITLE[quoteType].CARD_TITLE}
                            cardSubTitle={LIFE_FORM_TITLE[quoteType].CARD_SUB_TITLE}
                        >
                            {quoteType == LIFE_FORM_TYPES.IUL_ACCUMULATION ? (
                                <ProductPreferenceForm quoteType={quoteType} />
                            ) : (
                                <IulProtectionProductPreferenceForm quoteType={quoteType} />
                            )}
                        </LifeFormContainer>
                    ) : (
                        ""
                    )}
                </>
            )}
        </>
    );
};

ProductPreferenceContainer.propTypes = {
    contactId: PropTypes.string.isRequired,
    quoteType: PropTypes.oneOf([
        LIFE_FORM_TYPES.IUL_ACCUMULATION,
        LIFE_FORM_TYPES.IUL_PROTECTION,
        LIFE_FORM_TYPES.TERM,
    ]),
};
