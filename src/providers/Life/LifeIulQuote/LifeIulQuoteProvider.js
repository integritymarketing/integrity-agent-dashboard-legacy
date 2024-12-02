import { useEffect, useState , createContext, useMemo, useCallback } from "react";
import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import PropTypes from "prop-types";

import removeNullAndEmptyFields from "utils/removeNullAndEmptyFields";

export const LifeIulQuoteContext = createContext();

export const LifeIulQuoteProvider = ({ children }) => {
    const getLifeIulQuoteUrl = `${process.env.REACT_APP_QUOTE_URL}/api/v1/IUL/quotes`;
    const showToast = useToast();

    const [lifeIulQuoteResults, setLifeIulQuoteResults] = useState(null);
    const [tempUserDetails, setTempUserDetails] = useState(null);
    const [selectedCarriers, setSelectedCarriers] = useState(["All carriers"]);
    const [tabSelected, setTabSelected] = useState("");
    const [showFilters, setShowFilters] = useState(false);

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
                    if (!selectedCarriers.includes("All carriers") && selectedCarriers.length > 0) {
                        const updatedResults = response?.result.filter((result) =>
                            selectedCarriers.includes(result.companyName)
                        );

                        setLifeIulQuoteResults(updatedResults);
                    } else {
                        setLifeIulQuoteResults(response.result);
                    }

                    setTempUserDetails(response.result);
                    showToast({
                        message: `get quote successfully`,
                    });
                    return response;
                } else {
                    setLifeIulQuoteResults([]);
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

    const handleCarriersChange = (value) => {
        if (value === "All carriers") {
            setSelectedCarriers(["All carriers"]);
        } else {
            const individualCarriers = selectedCarriers.filter((carrier) => carrier !== "All carriers");
            if (individualCarriers?.includes(value)) {
                const updatedCarriers = individualCarriers.filter((carrier) => carrier !== value);
                if (updatedCarriers.length === 0) {
                    setSelectedCarriers(["All carriers"]);
                } else {
                    setSelectedCarriers(individualCarriers.filter((carrier) => carrier !== value));
                }
            } else {
                setSelectedCarriers([...individualCarriers, value]);
            }
        }
    };

    const handleTabSelection = (tab) => {
        setTabSelected(tab);
        const updatedResults = tempUserDetails.filter((result) => result.input.faceAmount === parseInt(tab));
        setLifeIulQuoteResults(updatedResults);
    };

    useEffect(() => {
        if (selectedCarriers.includes("All carriers")) {
            setLifeIulQuoteResults(tempUserDetails);
        } else {
            const updatedResults = tempUserDetails.filter((result) => selectedCarriers.includes(result.companyName));
            setLifeIulQuoteResults(updatedResults);
        }
    }, [selectedCarriers]);

    const contextValue = useMemo(
        () => ({
            fetchLifeIulQuoteResults,
            isLoadingLifeIulQuote,
            getLifeIulQuoteError,
            lifeIulQuoteResults,
            selectedCarriers,
            handleCarriersChange,
            tempUserDetails,
            handleTabSelection,
            tabSelected,
            setTabSelected,
            showFilters,
            setShowFilters,
        }),
        [
            fetchLifeIulQuoteResults,
            isLoadingLifeIulQuote,
            getLifeIulQuoteError,
            lifeIulQuoteResults,
            selectedCarriers,
            handleCarriersChange,
            tempUserDetails,
            handleTabSelection,
            tabSelected,
            setTabSelected,
            showFilters,
            setShowFilters,
        ]
    );

    return <LifeIulQuoteContext.Provider value={contextValue}>{children}</LifeIulQuoteContext.Provider>;
};

LifeIulQuoteProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};