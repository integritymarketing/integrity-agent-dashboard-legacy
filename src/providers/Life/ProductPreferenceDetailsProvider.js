import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import PropTypes from "prop-types";
import { createContext, useMemo, useState, useCallback } from "react";
import performAsyncOperation from "utilities/performAsyncOperation";
import removeNullAndEmptyFields from "utils/removeNullAndEmptyFields";

export const ProductPreferenceDetailsContext = createContext();

export const ProductPreferenceDetailsProvider = ({ children }) => {
    const productPreferenceUrl = `${process.env.REACT_APP_QUOTE_URL}/api/v1/IUL/`;
    const showToast = useToast();

    const [productPreferenceDetails, setProductPreferenceDetails] = useState(null);

    const {
        Post: submitProductPreference,
        loading: isLoadingCreatedProductPreference,
        error: createProductPreferenceError,
    } = useFetch(`${productPreferenceUrl}quotes`);

    const updateProductPreferenceDetails = useCallback(async (payloadData) => {
        const { birthdate, gender, addresses, healthClasses, faceAmounts, payPeriods, illustratedRate, loanType } =
            payloadData;

        const stateCode = addresses && addresses[0] ? addresses[0].stateCode : null;

        const reqData = {
            inputs: [
                {
                    birthDate: birthdate,
                    gender: gender === "female" ? "F" : "M",
                    healthClasses: [healthClasses],
                    state: stateCode,
                    faceAmounts: [String(faceAmounts)],
                    payPeriods: [payPeriods],
                    props: {
                        illustratedRate: illustratedRate,
                        loanType: loanType,
                    },
                },
            ],
            quoteType: "IULACCU-SOLVE",
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
                }
            );
            return result;
        } catch (error) {
            showToast({
                type: "error",
                message: `Failed to update Product Preference`,
            });
            return null;
        }
    }, [submitProductPreference, showToast]);

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
        ]
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
