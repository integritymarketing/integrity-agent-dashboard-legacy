import { useParams } from "react-router-dom";
import { useLeadDetails } from "providers/ContactDetails";
import WithLoader from "components/ui/WithLoader";
import { LIFE_FORM_TYPES } from "components/LifeForms/LifeForm.constants";
import { ProductPreferenceContainer } from "components/LifeForms/ProductPreference";
import { useProductPreferenceDetails } from "providers/Life";

export const IulAccumulationProductPreferenceForm = () => {
    const { contactId } = useParams();
    const { isLoadingLeadDetails } = useLeadDetails();
    const { isLoadingCreatedProductPreference } = useProductPreferenceDetails();

    return (
        <WithLoader isLoading={isLoadingLeadDetails || isLoadingCreatedProductPreference}>
            <ProductPreferenceContainer contactId={contactId} quoteType={LIFE_FORM_TYPES.IUL_ACCUMULATION} />
        </WithLoader>
    );
};

IulAccumulationProductPreferenceForm.propTypes = {};

export default IulAccumulationProductPreferenceForm;
