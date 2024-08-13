import React, { createContext, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import useFetch from "hooks/useFetch";
import { QUOTES_API_VERSION } from "services/clientsService";
import performAsyncOperation from "utilities/performAsyncOperation";
import useToast from "hooks/useToast";

/**
 * FinalExpensePlanListProvider component to provide final expenses plan context.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {React.Element} The rendered component.
 */

export const FinalExpensePlansContext = createContext();

export const FinalExpensePlansProvider = ({ children }) => {
    const showToast = useToast();
    const URL = `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/FinalExpenses/plans`;
    const QUOTE_URL = `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/FinalExpenses/quotes/Lead`;
    const CARRIERS_URL = `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/FinalExpenses/selfattest/carriers`;

    const {
        Get: fetchFinalExpensePlans,
        loading: isLoadingFinalExpensePlans,
        error: finalExpensePlansError,
    } = useFetch(URL);

    const {
        Get: fetchCarriersInfo,
        loading: isLoadingFetchCarriersInfo,
        error: fetchCarriersInfoError,
    } = useFetch(CARRIERS_URL);

    const { Post: fetchFinalExpenseQuotePlans } = useFetch(QUOTE_URL);

    const [finalExpensePlans, setFinalExpensePlans] = useState([]);
    const [carrierInfo, setCarrierInfo] = useState(null);

    const getFinalExpensePlans = useCallback(
        async (quoteId) => {
            const data = await fetchFinalExpensePlans(null, false, quoteId);
            setFinalExpensePlans(data?.Results || []);
        },
        [fetchFinalExpensePlans]
    );

    const fetchAndSetFilteredExpensePlans = useCallback(
        async (perPage, pageNumber, filterId, sortBy) => {
            const filteredURL = `?per_page=${perPage}&page=${pageNumber}&filterId=${filterId}&sort_by=${sortBy}`;
            const data = await fetchFinalExpensePlans(filteredURL);
            setFinalExpensePlans(data?.Results || []);
        },
        [fetchFinalExpensePlans]
    );

    const getFinalExpenseQuotePlans = useCallback(
        async (body, leadsId) => {
            const path = `${leadsId}`;
            const data = await fetchFinalExpenseQuotePlans(body, false, path);
            return data;
        },
        [fetchFinalExpensePlans]
    );

    const getCarriersInfo = async () => {
        await performAsyncOperation(
            () => fetchCarriersInfo(null, false),
            () => {},
            async (data) => {
                setCarrierInfo(data);
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to get Carriers info`,
                })
        );
    };

    return <FinalExpensePlansContext.Provider value={getContextValue()}>{children}</FinalExpensePlansContext.Provider>;

    function getContextValue() {
        return {
            getFinalExpensePlans,
            getFinalExpenseQuotePlans,
            finalExpensePlans,
            finalExpensePlansError,
            isLoadingFinalExpensePlans,
            fetchAndSetFilteredExpensePlans,
            getCarriersInfo,
            carrierInfo,
        };
    }
};

FinalExpensePlansProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
