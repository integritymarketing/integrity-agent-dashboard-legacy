import { useState, useCallback, useMemo } from 'react';
import { useCreateNewQuote } from 'providers/CreateNewQuote';

export const ERROR_1 =
  'Products are available for your quote but not in your appointed products.';
export const ERROR_2 =
  'Products are available for your quote but were excluded based on underwriting prescreening.';
export const ERROR_3 =
  'Products are available for your quote but were excluded based on underwriting prescreening and selling preferences.';
export const ERROR_4 = 'No products were excluded from your results.';
export const ERROR_5 =
  'No eligible policies match your quote details, but other products may be available.';

function useFinalExpenseErrorMessage(
  handleMyAppointedProductsCheck,
  handleIsShowExcludedProductsCheck,
  handleIsShowAlternativeProductsCheck
) {
  const [actionLink, setActionLink] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { isSimplifiedIUL } = useCreateNewQuote();

  const ERROR_6 = `No ${
    isSimplifiedIUL() ? 'Simplified IUL' : 'Final Expense'
  } Policies available. Review the selected filters and retry.`;

  /**
   * Derives the boolean flags for different quote result conditions.
   */
  const getPlanAvailability = useCallback(
    result => ({
      hasRtsPlans: result?.rtsPlans?.length > 0,
      hasNonRtsPlans: result?.nonRTSPlans?.length > 0,
      hasRtsPlansWithExclusions: result?.rtsPlansWithExclusions?.length > 0,
      hasNonRtsPlansWithExclusions:
        result?.nonRTSPlansWithExclusions?.length > 0,
      hasAlternativePlans: result?.alternativePlans?.length > 0,
    }),
    []
  );

  /**
   * Determines if any plan contains category reasons for exclusion.
   */
  const hasCategoryReason = useCallback(
    plans => plans?.some(plan => plan?.reason?.categoryReasons?.length > 0),
    []
  );

  /**
   * Updates the error message and action link based on conditions.
   */
  const updateErrorMessage = useCallback(
    (
      result,
      isMyAppointedProducts,
      isShowExcludedProducts,
      isShowAlternativeProducts
    ) => {
      setErrorMessage('');
      setActionLink(null);

      const {
        hasRtsPlans,
        hasNonRtsPlans,
        hasRtsPlansWithExclusions,
        hasNonRtsPlansWithExclusions,
        hasAlternativePlans,
      } = getPlanAvailability(result);

      if (isShowAlternativeProducts && !hasAlternativePlans) {
        setErrorMessage(ERROR_6);
      }

      if (isMyAppointedProducts && !isShowExcludedProducts) {
        if (!hasRtsPlans && hasNonRtsPlans) {
          setErrorMessage(ERROR_1);
          setActionLink({
            text: 'View Available Policies',
            callbackFunc: () => handleMyAppointedProductsCheck(false),
          });
        } else if (
          !hasRtsPlans &&
          !hasNonRtsPlans &&
          hasRtsPlansWithExclusions
        ) {
          setErrorMessage(
            hasCategoryReason(result.rtsPlansWithExclusions)
              ? isSimplifiedIUL()
                ? ERROR_5
                : ERROR_2
              : ERROR_3
          );
          setActionLink({
            text: 'View Excluded Products',
            callbackFunc: () => handleIsShowExcludedProductsCheck(true),
          });
        } else if (hasAlternativePlans && !hasRtsPlans && !hasNonRtsPlans) {
          setErrorMessage(ERROR_5);
          setActionLink({
            text: 'Show Alternative Policies',
            callbackFunc: () => handleIsShowAlternativeProductsCheck(true),
          });
        }
      } else if (
        !isMyAppointedProducts &&
        !isShowExcludedProducts &&
        !isShowAlternativeProducts
      ) {
        if (!hasRtsPlans && !hasNonRtsPlans && hasNonRtsPlansWithExclusions) {
          setErrorMessage(
            hasCategoryReason(result.nonRTSPlansWithExclusions)
              ? isSimplifiedIUL()
                ? ERROR_5
                : ERROR_2
              : ERROR_3
          );
          setActionLink({
            text: 'View Excluded Products',
            callbackFunc: () => handleIsShowExcludedProductsCheck(true),
          });
        }
      } else if (isMyAppointedProducts && isShowExcludedProducts) {
        if (!hasNonRtsPlansWithExclusions && !hasRtsPlansWithExclusions) {
          setErrorMessage(ERROR_4);
          setActionLink({
            text: 'View Available Policies',
            callbackFunc: () => handleMyAppointedProductsCheck(false),
          });
        }
      } else if (!isMyAppointedProducts && isShowExcludedProducts) {
        if (!hasNonRtsPlansWithExclusions) {
          setErrorMessage(ERROR_4);
          setActionLink({
            text: 'View Available Policies',
            callbackFunc: () => handleMyAppointedProductsCheck(true),
          });
        }
      }
    },
    [
      handleMyAppointedProductsCheck,
      handleIsShowExcludedProductsCheck,
      handleIsShowAlternativeProductsCheck,
      getPlanAvailability,
      hasCategoryReason,
      isSimplifiedIUL,
    ]
  );

  return { errorMessage, updateErrorMessage, actionLink };
}

export default useFinalExpenseErrorMessage;
