import React, { useMemo } from "react";
import PropTypes from "prop-types";
import PlanCardLoader from "components/ui/PlanCard/loader";
import { ContactProfileTabBar } from "components/ContactDetailsContainer";
import { LIFE_FORM_TYPES } from "../LifeForm.constants";
import { useLeadDetails } from "providers/ContactDetails";

export const ProductPreferenceForm = ({ contactId, quoteType }) => {
    const { isLoadingLeadDetails } = useLeadDetails();
    const renderContactDetailsLoader = useMemo(() => <PlanCardLoader />, []);

    return (
        <>
            <ContactProfileTabBar contactId={contactId} showTabs={false} />
            {isLoadingLeadDetails ? renderContactDetailsLoader : <div></div>}
        </>
    );
};

ProductPreferenceForm.propTypes = {
    contactId: PropTypes.string.isRequired,
    quoteType: PropTypes.oneOf([
        LIFE_FORM_TYPES.IUL_ACCUMULATION,
        LIFE_FORM_TYPES.IUL_PROTECTION,
        LIFE_FORM_TYPES.TERM,
    ]),
};
