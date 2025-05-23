import { LIFE_FORM_TYPES } from "components/LifeForms/LifeForm.constants";
import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import PropTypes from "prop-types";
import { createContext, useMemo, useState, useCallback } from "react";
import performAsyncOperation from "utilities/performAsyncOperation";
import removeNullAndEmptyFields from "utils/removeNullAndEmptyFields";

export const ProductPreferenceDetailsContext = createContext();

export const ProductPreferenceDetailsProvider = ({ children }) => {
    const productPreferenceUrl = `${import.meta.env.VITE_QUOTE_URL}/api/v1/IUL/`;
    const showToast = useToast();

    const [productPreferenceDetails, setProductPreferenceDetails] = useState(null);

    const {
        Post: submitProductPreference,
        loading: isLoadingCreatedProductPreference,
        error: createProductPreferenceError,
    } = useFetch(`${productPreferenceUrl}quotes`);

    const updateProductPreferenceDetails = useCallback(
        async (payloadData) => {
            const {
                birthdate,
                gender,
                addresses,
                healthClasses,
                faceAmounts,
                faceAmounts2,
                faceAmounts3,
                payPeriods,
                illustratedRate,
                loanType,
                quoteType,
                solves,
            } = payloadData;

            const stateCode = addresses && addresses[0] ? addresses[0].stateCode : null;

            const reqData = {
                inputs: [
                    {
                        birthDate: birthdate,
                        gender: gender === "female" ? "F" : "M",
                        healthClasses: [healthClasses],
                        state: stateCode,
                        faceAmounts:
                            quoteType == LIFE_FORM_TYPES.IUL_ACCUMULATION
                                ? [String(faceAmounts)]
                                : [String(faceAmounts), String(faceAmounts2), String(faceAmounts3)],
                        payPeriods: [payPeriods],
                        props: {
                            illustratedRate: illustratedRate,
                            loanType: loanType,
                        },
                        solves: [solves],
                    },
                ],
                quoteType: quoteType == LIFE_FORM_TYPES.IUL_ACCUMULATION ? "IULACCU-SOLVE" : "IULPROT-SOLVE",
            };

            const payload = removeNullAndEmptyFields(reqData);
            try {
                const result = await performAsyncOperation(
                    () => submitProductPreference(payload, false),
                    () => { },
                    (responseData) => {
                        showToast({
                            message: `Product Preference submitted successfully`,
                        });
                        return responseData;
                    },
                );
                return result;
            } catch (error) {
                showToast({
                    type: "error",
                    message: `Failed to update Product Preference`,
                });
                return null;
            }
        },
        [submitProductPreference, showToast],
    );

    const contextValue = useMemo(
        () => ({
            updateProductPreferenceDetails,
            isLoadingCreatedProductPreference,
            createProductPreferenceError,
            productPreferenceDetails,
        }),
        [
            updateProductPreferenceDetails,
            isLoadingCreatedProductPreference,
            createProductPreferenceError,
            productPreferenceDetails,
        ],
    );

    return (
        <ProductPreferenceDetailsContext.Provider value={contextValue}>
            {children}
        </ProductPreferenceDetailsContext.Provider>
    );
};

ProductPreferenceDetailsProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
