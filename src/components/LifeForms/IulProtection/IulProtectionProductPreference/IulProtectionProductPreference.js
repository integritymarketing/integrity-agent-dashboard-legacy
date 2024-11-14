
import WithLoader from "components/ui/WithLoader";
import { useParams } from "react-router-dom";
import { useLeadDetails } from "providers/ContactDetails";
import { LIFE_FORM_TYPES } from "components/LifeForms/LifeForm.constants";
import { ProductPreferenceContainer } from "components/LifeForms/ProductPreference";

export const IulProtectionProductPreferenceForm = () => {
    const { contactId } = useParams();
    const { isLoadingLeadDetails } = useLeadDetails();

    return (
        <WithLoader isLoading={isLoadingLeadDetails}>
            <ProductPreferenceContainer contactId={contactId} quoteType={LIFE_FORM_TYPES.IUL_PROTECTION} />
        </WithLoader>
    );
};
