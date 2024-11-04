import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useLeadDetails } from "providers/ContactDetails";
import WithLoader from "components/ui/WithLoader";
import { ProductPreferenceForm } from "components/LifeForms/ProductPreference";
import { LIFE_FORM_TYPES } from "components/LifeForms/LifeForm.constants";

export const IulAccumulationProductPreferenceForm = ({}) => {
    const { contactId } = useParams();
    const { isLoadingLeadDetails } = useLeadDetails();

    return (
        <WithLoader isLoading={isLoadingLeadDetails}>
            <ProductPreferenceForm contactId={contactId} quoteType={LIFE_FORM_TYPES.IUL_ACCUMULATION} />
        </WithLoader>
    );
};
