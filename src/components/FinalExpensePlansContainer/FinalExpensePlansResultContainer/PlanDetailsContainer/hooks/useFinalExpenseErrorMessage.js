import { useState, useCallback } from "react";
import { useCreateNewQuote } from "providers/CreateNewQuote";

export const ERROR_1 = "Products are available for your quote but not in your appointed products.";
export const ERROR_2 = "Products are available for your quote but were excluded based on underwriting prescreening.";
export const ERROR_3 =
    "Products are available for your quote but were excluded based on underwriting prescreening and selling preferences.";
export const ERROR_4 = "No products were excluded from your results.";
export const ERROR_5 = "No eligible policies match your quote details, but other products may be available.";

function useFinalExpenseErrorMessage(handleMyAppointedProductsCheck, handleIsShowExcludedProductsCheck) {
    const [actionLink, setActionLink] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const { isSimplifiedIUL } = useCreateNewQuote();

    const updateErrorMesssage = useCallback(
        (result, isMyAppointedProducts, isShowExcludedProducts) => {
            // Reset error message and Action link
            setErrorMessage("");
            setActionLink(null);

            const rtsPlans = result?.rtsPlans ?? [];
            const nonRTSPlans = result?.nonRTSPlans ?? [];
            const rtsPlansWithExclusions = result?.rtsPlansWithExclusions ?? [];
            const nonRTSPlansWithExclusions = result?.nonRTSPlansWithExclusions ?? [];

            const hasRtsPlans = rtsPlans.length > 0;
            const hasNonRtsPlans = nonRTSPlans.length > 0;
            const hasRtsPlansWithExclusions = rtsPlansWithExclusions.length > 0;
            const hasNonRTSPlansWithExclusions = nonRTSPlansWithExclusions.length > 0;

            if (isMyAppointedProducts && !isShowExcludedProducts) {
                if (!hasRtsPlans && hasNonRtsPlans) {
                    setErrorMessage(ERROR_1);
                    setActionLink({
                        text: "View Available Products",
                        callbackFunc: () => handleMyAppointedProductsCheck(),
                    });
                } else if (!hasRtsPlans && !hasNonRtsPlans && hasRtsPlansWithExclusions) {
                    const hasPlanWithCategoryReason = rtsPlansWithExclusions.some(
                        (plan) => plan.reason && plan.reason.categoryReasons && plan.reason.categoryReasons.length > 0
                    );
                    if (hasPlanWithCategoryReason) {
                        setErrorMessage(isSimplifiedIUL() ? ERROR_5 : ERROR_2);
                    } else {
                        setErrorMessage(ERROR_3);
                    }
                    setActionLink({
                        text: "View Excluded Products",
                        callbackFunc: () => handleIsShowExcludedProductsCheck(),
                    });
                }
            } else if (!isMyAppointedProducts && !isShowExcludedProducts) {
                if (!hasRtsPlans && !hasNonRtsPlans && hasNonRTSPlansWithExclusions) {
                    const hasPlanWithCategoryReason = nonRTSPlansWithExclusions.some(
                        (plan) => plan.reason && plan.reason.categoryReasons && plan.reason.categoryReasons.length > 0,
                    );
                    if (hasPlanWithCategoryReason) {
                        setErrorMessage(isSimplifiedIUL() ? ERROR_5 : ERROR_2);
                    } else {
                        setErrorMessage(ERROR_3);
                    }
                    setActionLink({
                        text: "View Excluded Products",
                        callbackFunc: () => handleIsShowExcludedProductsCheck(),
                    });
                }
            } else if (isMyAppointedProducts && isShowExcludedProducts) {
                if (!hasNonRTSPlansWithExclusions && !hasRtsPlansWithExclusions) {
                    setErrorMessage(ERROR_4);
                    setActionLink({
                        text: "View Available Products",
                        callbackFunc: () => handleIsShowExcludedProductsCheck(),
                    });
                }
            } else if (!isMyAppointedProducts && isShowExcludedProducts) {
                if (!hasNonRTSPlansWithExclusions) {
                    setErrorMessage(ERROR_4);
                    setActionLink({
                        text: "View Available Products",
                        callbackFunc: () => handleIsShowExcludedProductsCheck(),
                    });
                }
            }
        },
        [handleIsShowExcludedProductsCheck, handleMyAppointedProductsCheck],
    );

    return { errorMessage, updateErrorMesssage, actionLink };
}

export default useFinalExpenseErrorMessage;
