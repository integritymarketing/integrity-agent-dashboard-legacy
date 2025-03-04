import { createContext, useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useAgentAccountContext } from "providers/AgentAccountProvider";
import useUserProfile from "hooks/useUserProfile";
import useToast from "hooks/useToast";
import { useNavigate } from "react-router-dom";
import useAnalytics from "hooks/useAnalytics";
import useFetch from "hooks/useFetch";
import { LIFE_QUESTION_CARD_LIST } from "../../components/CreateNewQuoteContainer/QuickQuoteModals/LifeQuestionCard/constants";

export const CreateNewQuoteContext = createContext();

export const CreateNewQuoteProvider = ({ children }) => {
    const { updateAgentPreferences, leadPreference } = useAgentAccountContext();
    const { fireEvent } = useAnalytics();
    const { agentId } = useUserProfile();
    const showToast = useToast();
    const navigate = useNavigate();

    const LIFE = "hideLifeQuote";
    const HEALTH = "hideHealthQuote";

    const IUL_FEATURE_FLAG = import.meta.env.VITE_IUL_FEATURE_FLAG === "show";

    const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);
    const [createNewContactModalOpen, setCreateNewContactModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [newLeadDetails, setNewLeadDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phones: {
            leadPhone: "",
            phoneLabel: "",
        },
        primaryCommunication: "",
    });
    const [showStartQuoteModal, setShowStartQuoteModal] = useState(false);
    const [quoteModalStage, setQuoteModalStage] = useState("");
    const [selectedProductType, setSelectedProductType] = useState(null);
    const [selectedLifeProductType, setSelectedLifeProductType] = useState(null);
    const [selectedHealthProductType, setSelectedHealthProductType] = useState(null);
    const [selectedIulGoal, setSelectedIulGoal] = useState(null);
    const [finalExpenseIntakeFormData, setFinalExpenseIntakeFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
    });
    const [showZipCodeInput, setShowZipCodeInput] = useState(false);
    const [doNotShowAgain, setDoNotShowAgain] = useState(false);
    const [isMultipleCounties, setIsMultipleCounties] = useState(false);
    const [countiesData, setCountiesData] = useState([]);

    const zipCode = selectedLead?.addresses?.[0]?.postalCode;
    const URL = `${import.meta.env.VITE_QUOTE_URL}/api/v1.0/Search/GetCounties?zipcode=${zipCode}`;
    const { Get: getCounties } = useFetch(URL);
    const county = selectedLead?.addresses?.[0]?.county;

    const fetchCountiesData = useCallback(async () => {
        const counties = await getCounties();
        setCountiesData(counties);
        setIsMultipleCounties(counties?.length > 1 && !county);
    }, [county, getCounties]);

    // Define handleClose before any function that references it
    const handleClose = useCallback(() => {
        setQuoteModalStage("");
        setShowStartQuoteModal(false);
        setSelectedLead(null);
        setCreateNewContactModalOpen(false);
        setContactSearchModalOpen(false);
        setDoNotShowAgain(false);
    }, []);

    // Update agent preferences during user selected Do not show again //
    const editAgentPreferences = useCallback(
        async (type) => {
            try {
                const updatedType = type === "life" ? HEALTH : LIFE;
                const payload = {
                    agentID: agentId,
                    leadPreference: {
                        ...leadPreference,
                        [updatedType]: true,
                    },
                };
                await updateAgentPreferences(payload);
            } catch (error) {
                showToast({
                    type: "error",
                    message: "Failed to save the preferences.",
                    time: 10000,
                });
            }
        },
        [agentId, leadPreference, showToast, updateAgentPreferences]
    );

    const handleAgentProductPreferenceType = useCallback(
        (lead) => {
            setShowStartQuoteModal(true);
            const postalCode = lead?.addresses?.length > 0 ? lead?.addresses[0]?.postalCode : null;
            const leadCounty = lead?.addresses?.length > 0 ? lead?.addresses[0]?.county : null;

            if (!leadPreference?.hideLifeQuote && !leadPreference?.hideHealthQuote) {
                setQuoteModalStage("selectProductTypeCard");
            } else {
                setSelectedProductType(leadPreference?.hideLifeQuote ? "health" : "life");
                if (!leadPreference?.hideLifeQuote && leadCounty) {
                    if (IUL_FEATURE_FLAG) {
                        setQuoteModalStage("lifeQuestionCard");
                    } else {
                        setQuoteModalStage("finalExpenseIntakeFormCard");
                    }
                } else {
                    if (postalCode && leadCounty) {
                        fireEvent("New Quote Created With Instant Quote", {
                            leadId: lead?.leadsId,
                            line_of_business: "Health",
                            contactType: newLeadDetails?.firstName ? "New Contact" : "Existing Contact",
                        });
                        navigate(`/plans/${lead?.leadsId}`);
                        handleClose();
                    } else {
                        setQuoteModalStage("zipCodeInputCard");
                    }
                }
            }
        },
        [leadPreference, IUL_FEATURE_FLAG, fireEvent, navigate, newLeadDetails, handleClose]
    );

    const handleSelectedLead = useCallback(
        (lead, type) => {
            if (type === "new") {
                setNewLeadDetails({
                    ...newLeadDetails,
                    firstName: lead?.split(" ")[0],
                    lastName: lead?.split(" ")[1],
                });
                setSelectedLead(null);
                setContactSearchModalOpen(false);
                setCreateNewContactModalOpen(true);
            } else {
                setSelectedLead(lead);
                setContactSearchModalOpen(false);
                setCreateNewContactModalOpen(false);
                handleAgentProductPreferenceType(lead);
            }
        },
        [newLeadDetails, handleAgentProductPreferenceType]
    );

    const showUpArrow = useMemo(() => {
        return !leadPreference?.hideLifeQuote && !leadPreference?.hideHealthQuote;
    }, [leadPreference]);

    const handleSelectedProductType = useCallback(
        (productType) => {
            if (doNotShowAgain) {
                editAgentPreferences(productType);
            }
            setSelectedProductType(productType);
            if (productType === "life") {
                if (IUL_FEATURE_FLAG) {
                    setQuoteModalStage("lifeQuestionCard");
                } else {
                    setQuoteModalStage("finalExpenseIntakeFormCard");
                }
            } else {
                const postalCode = selectedLead?.addresses?.length > 0 ? selectedLead?.addresses[0]?.postalCode : null;
                const countyDetails = selectedLead?.addresses?.length > 0 ? selectedLead?.addresses[0]?.county : null;

                if (postalCode && countyDetails) {
                    fireEvent("New Quote Created With Instant Quote", {
                        leadId: selectedLead?.leadsId,
                        line_of_business: "Health",
                        contactType: newLeadDetails?.firstName ? "New Contact" : "Existing Contact",
                    });
                    navigate(`/plans/${selectedLead?.leadsId}`);
                    handleClose();
                } else {
                    setQuoteModalStage("zipCodeInputCard");
                }
            }
        },
        [
            doNotShowAgain,
            editAgentPreferences,
            setSelectedProductType,
            setQuoteModalStage,
            fireEvent,
            navigate,
            handleClose,
            selectedLead,
            IUL_FEATURE_FLAG,
            newLeadDetails,
        ]
    );

    const handleSelectLifeProductType = useCallback(
        (productType) => {
            setSelectedLifeProductType(productType);

            switch (productType) {
                case LIFE_QUESTION_CARD_LIST.FINAL_EXPENSE:
                case LIFE_QUESTION_CARD_LIST.SIMPLIFIED_INDEXED_UNIVERSAL_LIFE:
                    setQuoteModalStage("finalExpenseIntakeFormCard");
                    break;
                case LIFE_QUESTION_CARD_LIST.INDEXED_UNIVERSAL_LIFE:
                    setQuoteModalStage("iulGoalCard");
                    break;
                case LIFE_QUESTION_CARD_LIST.TERM:
                    navigate(`/life/term/${selectedLead.leadsId}/confirm-details`);
                    setShowStartQuoteModal(false);
                    break;
                default:
                    break;
            }
        },
        [navigate, selectedLead, setSelectedLifeProductType]
    );

    const handleSelectIulGoalType = useCallback(
        (productType) => {
            setSelectedLifeProductType(productType);

            switch (productType) {
                case "Accumulation":
                    navigate(`/life/iul-accumulation/${selectedLead.leadsId}/confirm-details`);
                    break;
                case "Protection":
                    navigate(`/life/iul-protection/${selectedLead.leadsId}/confirm-details`);
                    break;
            }
            setShowStartQuoteModal(false);
        },
        [navigate, selectedLead]
    );

    const handleSelectedHealthProductType = useCallback(
        (productType) => {
            setSelectedHealthProductType(productType);
            const postalCode = selectedLead?.addresses?.length > 0 ? selectedLead?.addresses[0]?.postalCode : null;
            const countyDetails = selectedLead?.addresses?.length > 0 ? selectedLead?.addresses[0]?.county : null;
            if (postalCode && countyDetails) {
                fireEvent("New Quote Created With Instant Quote", {
                    leadId: selectedLead?.leadsId,
                    line_of_business: "Health",
                    contactType: newLeadDetails?.firstName ? "New Contact" : "Existing Contact",
                });
                navigate(`/plans/${selectedLead?.leadsId}`);
                handleClose();
            } else {
                setQuoteModalStage("zipCodeInputCard");
            }
        },
        [selectedLead, fireEvent, navigate, newLeadDetails, handleClose]
    );

    const handleSelectIulGoal = useCallback((goal) => {
        setSelectedIulGoal(goal);
        setQuoteModalStage("finalExpenseIntakeFormCard");
    }, []);

    const isSimplifiedIUL = useCallback(() => {
        return selectedLifeProductType === LIFE_QUESTION_CARD_LIST.SIMPLIFIED_INDEXED_UNIVERSAL_LIFE;
    }, [selectedLifeProductType]);

    return <CreateNewQuoteContext.Provider value={getContextValue()}>{children}</CreateNewQuoteContext.Provider>;

    function getContextValue() {
        return {
            selectedLead,
            handleSelectedLead,
            newLeadDetails,
            setNewLeadDetails,
            createNewContactModalOpen,
            setCreateNewContactModalOpen,
            contactSearchModalOpen,
            setContactSearchModalOpen,
            selectedProductType,
            setSelectedProductType,
            selectedLifeProductType,
            setSelectedLifeProductType,
            selectedHealthProductType,
            setSelectedHealthProductType,
            selectedIulGoal,
            setSelectedIulGoal,
            finalExpenseIntakeFormData,
            setFinalExpenseIntakeFormData,
            showZipCodeInput,
            setShowZipCodeInput,
            doNotShowAgain,
            setDoNotShowAgain,
            handleSelectedProductType,
            handleSelectLifeProductType,
            handleSelectedHealthProductType,
            handleAgentProductPreferenceType,
            editAgentPreferences,
            showStartQuoteModal,
            setShowStartQuoteModal,
            quoteModalStage,
            setQuoteModalStage,
            handleSelectIulGoal,
            handleClose,
            showUpArrow,
            IUL_FEATURE_FLAG,
            isMultipleCounties,
            fetchCountiesData,
            countiesData,
            handleSelectIulGoalType,
            isSimplifiedIUL,
        };
    }
};

CreateNewQuoteProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};