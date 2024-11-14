import { useParams } from "react-router-dom";
import WithLoader from "components/ui/WithLoader";
import { useLeadDetails } from "providers/ContactDetails";
import { ConfirmationDetailsContainer } from "../../ConfirmationDetails";
import { LIFE_FORM_TYPES } from "../../LifeForm.constants";

export const IulProtectionConfirmationDetail = () => {
    const { contactId } = useParams();
    const { isLoadingLeadDetails } = useLeadDetails();

    return (
        <WithLoader isLoading={isLoadingLeadDetails}>
            <ConfirmationDetailsContainer contactId={contactId} quoteType={LIFE_FORM_TYPES.IUL_ACCUMULATION} />
        </WithLoader>
    );
};

export default IulProtectionConfirmationDetail;
