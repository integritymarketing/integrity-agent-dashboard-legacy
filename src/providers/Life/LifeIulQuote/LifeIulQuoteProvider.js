import React, { useEffect, useState } from "react";
import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import PropTypes from "prop-types";
import { createContext, useMemo, useCallback } from "react";
import removeNullAndEmptyFields from "utils/removeNullAndEmptyFields";

export const LifeIulQuoteContext = createContext();

export const LifeIulQuoteProvider = ({ children }) => {
    const getLifeIulQuoteUrl = `${process.env.REACT_APP_QUOTE_URL}/api/v1/IUL/quotes`;
    const showToast = useToast();

    const [lifeIulQuoteResults, setLifeIulQuoteResults] = useState(null);

    const {
        Post: getLifeIulQuoteDetails,
        loading: isLoadingLifeIulQuote,
        error: getLifeIulQuoteError,
    } = useFetch(getLifeIulQuoteUrl);

    const fetchLifeIulQuoteResults = useCallback(
        async (reqData) => {
            const payload = removeNullAndEmptyFields(reqData);
            try {
                const response = await getLifeIulQuoteDetails(payload, false);
                if (response && response?.result && response?.result?.length > 0) {
                    setLifeIulQuoteResults(response.result);

                    showToast({
                        message: `get quote successfully`,
                    });
                    return response;
                }
            } catch (error) {
                showToast({
                    type: "error",
                    message: `Failed to get quote`,
                });
                return null;
            }
        },
        [getLifeIulQuoteDetails, showToast, selectedCarriers]
    );

    const contextValue = useMemo(
        () => ({
            fetchLifeIulQuoteResults,
            isLoadingLifeIulQuote,
            getLifeIulQuoteError,
            lifeIulQuoteResults,
        }),
        [fetchLifeIulQuoteResults, isLoadingLifeIulQuote, getLifeIulQuoteError, lifeIulQuoteResults]
    );

    return <LifeIulQuoteContext.Provider value={contextValue}>{children}</LifeIulQuoteContext.Provider>;
};

LifeIulQuoteProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
