import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useLeadDetails } from "providers/ContactDetails";

import { formatDate } from "utils/dates";
import { formatMbiNumber } from "utils/shared-utils/sharedUtility";

import useAnalytics from "hooks/useAnalytics";

import PlanCardLoader from "components/ui/PlanCard/loader";
import WithLoader from "components/ui/WithLoader";

import FinalExpenseContactDetailsForm from "./FinalExpenseContactDetailsForm";
import { ContactProfileTabBar } from "components/ContactDetailsContainer";
import { useCreateNewQuote } from "../../providers/CreateNewQuote";
import styles from "./index.module.scss";
import { SIMPLIFIED_IUL_TITLE } from "./FinalExpensePlansContainer.constants";
import Typography from "@mui/material/Typography";

export const FinalExpensePlansContainer = () => {
    const { contactId } = useParams();
    const contactFormDataRef = useRef(null);

    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();

    const { leadDetails, updateLeadDetails, isLoadingLeadDetails } = useLeadDetails();
    const { isSimplifiedIUL } = useCreateNewQuote();

    useEffect(() => {
        fireEvent("Final Expense Intake Viewed", {
            leadid: contactId,
        });
    }, [contactId]);

    const onSave = useCallback(
        async (formData) => {
            const {
                modifyDate,
                addresses,
                contactPreferences,
                emails,
                phones,
                firstName,
                lastName,
                middleName,
                leadsId,
                contactRecordType,
                leadStatusId,
                notes,
                medicareBeneficiaryID,
                partA,
                partB,
            } = leadDetails;

            const code = JSON.stringify({ stateCode: formData.stateCode });
            sessionStorage.setItem(contactId, code);

            const email = emails.length > 0 ? emails[0].leadEmail : null;
            const phoneData = phones.length > 0 ? phones[0] : null;
            const addressData = addresses.length > 0 ? addresses?.[0] : null;
            const emailID = emails.length > 0 ? emails[0].emailID : 0;
            const leadAddressId = addressData && addressData.leadAddressId ? addressData.leadAddressId : 0;
            const phoneId = phoneData && phoneData.phoneId ? phoneData.phoneId : 0;

            const city = addressData && addressData.city ? addressData.city : "";
            const stateCode = addressData && addressData.stateCode ? addressData.stateCode : "";
            const address1 = addressData && addressData.address1 ? addressData.address1 : "";
            const address2 = addressData && addressData.address2 ? addressData.address2 : "";
            const county = addressData && addressData.county ? addressData.county : "";
            const countyFips = addressData && addressData.countyFips ? addressData.countyFips : "";
            const postalCode = addressData && addressData.postalCode ? addressData.postalCode : "";
            const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";
            const phoneLabel = phoneData && phoneData.phoneLabel ? phoneData.phoneLabel : "mobile";

            const isPrimary = contactPreferences?.primary ? contactPreferences?.primary : "email";

            const initialValues = {
                firstName: firstName,
                lastName: lastName,
                middleName: middleName,
                email: email,
                birthdate: leadDetails?.birthdate ? formatDate(leadDetails?.birthdate) : "",
                address: {
                    address1: address1,
                    address2: address2,
                    city: city,
                    stateCode: stateCode,
                    postalCode: postalCode,
                    county: county || "",
                    countyFips: countyFips,
                },
                primaryCommunication: isPrimary,
                contactRecordType: contactRecordType?.toLowerCase(),
                emailID,
                leadAddressId,
                phoneId,
                leadStatusId,
                leadsId,
                modifyDate,
                notes,
                medicareBeneficiaryID: medicareBeneficiaryID ? formatMbiNumber(medicareBeneficiaryID) : "",
                partA: partA ?? "",
                partB: partB ?? "",
                ...formData,
            };

            if (phone) {
                initialValues.phones = {
                    leadPhone: phone,
                    phoneLabel: phoneLabel?.toLowerCase(),
                };
            }

            const payload = {
                ...leadDetails,
                ...initialValues,
            };

            const response = await updateLeadDetails(payload);

            contactFormDataRef.current = { ...formData };
            fireEvent("Final Expense Intake Completed", {
                leadid: contactId,
            });

            // Ensure isSimplifiedIUL() is reevaluated correctly
            if (await isSimplifiedIUL()) {
                navigate(`/simplified-iul/healthconditions/${contactId}`);
            } else {
                navigate(`/finalexpenses/healthconditions/${contactId}`);
            }
        },
        [isSimplifiedIUL, leadDetails, updateLeadDetails, contactId, navigate, fireEvent],
    );

    const renderContactDetailsLoader = useMemo(() => <PlanCardLoader />, []);
    return (
        <WithLoader isLoading={isLoadingLeadDetails}>
            <ContactProfileTabBar contactId={contactId} showTabs={false} />
            <div className={styles.pageHeading}>{isSimplifiedIUL() && <Typography variant="h2" color="#052A63">
    {SIMPLIFIED_IUL_TITLE}
</Typography>}</div>
            {isLoadingLeadDetails ? (
                renderContactDetailsLoader
            ) : (
                <FinalExpenseContactDetailsForm contactId={contactId} onSave={onSave} />
            )}
        </WithLoader>
    );
};
 