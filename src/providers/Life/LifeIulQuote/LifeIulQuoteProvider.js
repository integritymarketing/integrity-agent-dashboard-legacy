import { useEffect, useState, createContext, useMemo, useCallback } from "react";
import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import PropTypes from "prop-types";

import removeNullAndEmptyFields from "utils/removeNullAndEmptyFields";

export const LifeIulQuoteContext = createContext();

export const LifeIulQuoteProvider = ({ children }) => {
    const getLifeIulQuoteUrl = `${process.env.REACT_APP_QUOTE_URL}/api/v1/IUL/quotes`;
    const applyLifeIulQuoteUrl = `${process.env.REACT_APP_ENROLLMENT_API}/api/v1.0/IUL/lead`;
    const getLifeIulQuoteDetailsUrl = `${process.env.REACT_APP_QUOTE_URL}/api/v1.0/IUL/policydetails`;
    const showToast = useToast();

    const [lifeIulQuoteResults, setLifeIulQuoteResults] = useState(null);
    const [tempUserDetails, setTempUserDetails] = useState(null);
    const [selectedCarriers, setSelectedCarriers] = useState(["All carriers"]);
    const [tabSelected, setTabSelected] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [lifeIulDetails, setLifeIulDetails] = useState(null);

    const {
        Post: getLifeIulQuoteResults,
        loading: isLoadingLifeIulQuote,
        error: getLifeIulQuoteError,
    } = useFetch(getLifeIulQuoteUrl);

    const {
        Post: applyLifeIulQuoteDetails,
        loading: isLoadingApplyLifeIulQuote,
        error: getApplyLifeIulQuoteError,
    } = useFetch(applyLifeIulQuoteUrl);

    const {
        Get: getLifeIulQuoteDetails,
        loading: isLoadingLifeIulQuoteDetails,
        error: getLifeIulQuoteDetailsError,
    } = useFetch(getLifeIulQuoteDetailsUrl);

    const reset = () => {
        setLifeIulQuoteResults(null);
        setTempUserDetails(null);
        setTabSelected(0);
        setSelectedPlans([]);
    };

    const fetchLifeIulQuoteResults = useCallback(
        async (reqData) => {
            reset();
            const payload = removeNullAndEmptyFields(reqData);
            try {
                const response = await getLifeIulQuoteResults(payload, false);
                if (response && response?.result && response?.result?.length > 0) {
                    if (!selectedCarriers.includes("All carriers") && selectedCarriers.length > 0) {
                        const updatedResults = response?.result.filter((result) =>
                            selectedCarriers.includes(result.companyName),
                        );

                        setLifeIulQuoteResults(updatedResults);
                    } else {
                        setLifeIulQuoteResults(response.result);
                    }
                    setTempUserDetails(response.result);
                    if (reqData?.quoteType === "IULPROT-SOLVE") {
                        const faceAmounts = reqData?.inputs[0]?.faceAmounts;
                        handleTabSelection(faceAmounts[0], response.result);
                    }
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
        [getLifeIulQuoteResults, showToast, selectedCarriers],
    );

    const fetchLifeIulQuoteDetails = useCallback(
        async (id) => {
            try {
                const response = await getLifeIulQuoteDetails(null, false, id);
                if (response) {
                    setLifeIulDetails(response);
                    return response;
                }
            } catch (error) {
                showToast({
                    type: "error",
                    message: `Failed to get quote details`,
                });
                return null;
            }
        },
        [getLifeIulQuoteDetails, showToast],
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

    const handleTabSelection = (tab, list) => {
        setTabSelected(tab);
        const updatedResults = list?.filter((result) => result.input.faceAmount === parseInt(tab));
        setLifeIulQuoteResults(updatedResults);
    };

    const handleComparePlanSelect = (plan) => {
        const isPlanSelected = selectedPlans?.filter((selectedPlan) => selectedPlan.rowId === plan.rowId);
        if (isPlanSelected?.length > 0) {
            const updatedPlans = selectedPlans.filter((selectedPlan) => selectedPlan.rowId !== plan.rowId);
            setSelectedPlans(updatedPlans);
        } else {
            setSelectedPlans([
                ...selectedPlans,
                { logo: plan.companyLogoImageUrl, name: plan.productName, rowId: plan.rowId },
            ]);
        }
    };

    const handleIULQuoteApplyClick = useCallback(
        async (reqData, leadId) => {
            const payload = removeNullAndEmptyFields(reqData);
            const obj = {
                enroller: {
                    agentLastName: payload?.agentLastName,
                    agentFirstName: payload?.agentFirstName,
                    agentEmail: payload?.email,
                    agentNumber: payload?.agentNPN,
                },
                enrollee: {
                    firstName: payload?.firstName,
                    middleName: payload?.middleName,
                    lastName: payload?.lastName,
                    gender: payload?.gender == "male" ? "M" : "F",
                    dateOfBirth: payload?.birthdate,
                    emailAddress: payload?.email,
                    phoneNumber: payload?.phones[0]?.leadPhone,
                    address1: payload?.addresses[0]?.address1,
                    city: payload?.addresses[0]?.city,
                    state: payload?.addresses[0]?.stateCode,
                    zipCode: payload?.addresses[0]?.postalCode,
                    effectiveDate: new Date(payload?.effectiveDate).toISOString(),
                },
                ssoPrefillFields: {
                    product_itmtxt: payload?.ssoPrefillFields.product_itmtxt,
                    carrier: payload?.ssoPrefillFields.carrier,
                    product: payload?.ssoPrefillFields.product,
                    poL_Product: payload?.ssoPrefillFields.poL_Product,
                    productType: payload?.ssoPrefillFields.productType,
                },
                productName: payload?.productName,
                carrierUrl: payload?.carrierUrl || "",
                carrierName: payload?.companyName || "",
                planType: "IUL",
            };

            const response = await applyLifeIulQuoteDetails(obj, false, leadId);
            console.log("response", response);

            if (response?.redirectUrl) {
                window.open(response.redirectUrl, "_blank");
            }

            return response;
        },
        [applyLifeIulQuoteDetails],
    );


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
            handleComparePlanSelect,
            selectedPlans,
            handleIULQuoteApplyClick,
            isLoadingApplyLifeIulQuote,
            getApplyLifeIulQuoteError,
            fetchLifeIulQuoteDetails,
            isLoadingLifeIulQuoteDetails,
            getLifeIulQuoteDetailsError,
            lifeIulDetails,
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
            handleComparePlanSelect,
            selectedPlans,
            handleIULQuoteApplyClick,
            isLoadingApplyLifeIulQuote,
            getApplyLifeIulQuoteError,
            fetchLifeIulQuoteDetails,
            isLoadingLifeIulQuoteDetails,
            getLifeIulQuoteDetailsError,
            lifeIulDetails,
        ],
    );

    return <LifeIulQuoteContext.Provider value={contextValue}>{children}</LifeIulQuoteContext.Provider>;
};

LifeIulQuoteProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
