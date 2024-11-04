import React from "react";
import PropTypes from "prop-types";
import { ProductPreferenceForm } from "components/LifeForms/ProductPreference";
import WithLoader from "components/ui/WithLoader";
import { useParams } from "react-router-dom";
import { useLeadDetails } from "providers/ContactDetails";
import { LIFE_FORM_TYPES } from "components/LifeForms/LifeForm.constants";

export const IulProtectionProductPreferenceForm = ({}) => {
    const { contactId } = useParams();
    const { isLoadingLeadDetails } = useLeadDetails();

    return (
        <WithLoader isLoading={isLoadingLeadDetails}>
            <ProductPreferenceForm contactId={contactId} quoteType={LIFE_FORM_TYPES.IUL_ACCUMULATION} />
        </WithLoader>
    );
};

IulProtectionProductPreferenceForm.propTypes = {};
