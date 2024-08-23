import { createContext, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useAgentAccountContext } from "providers/AgentAccountProvider";
import useUserProfile from "hooks/useUserProfile";
import useToast from "hooks/useToast";
import { useNavigate } from "react-router-dom";
import useAnalytics from "hooks/useAnalytics";

export const CreateNewQuoteContext = createContext();

export const CreateNewQuoteProvider = ({ children }) => {
    const { updateAgentPreferences, leadPreference } = useAgentAccountContext();
    const { fireEvent } = useAnalytics();
    const { agentId } = useUserProfile();
    const showToast = useToast();
    const navigate = useNavigate();

    const LIFE = "hideLifeQuote";
    const HEALTH = "hideHealthQuote";

    const IUL_FEATURE_FLAG = process.env.REACT_APP_IUL_FEATURE_FLAG === "show";

    const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);
    const [createNewContactModalOpen, setCreateNewContactModalOpen] = useState(false);

    const [selectedLead, setSelectedLead] = useState(null);
    const [newLeadDetails, setNewLeadDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
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

            if (!leadPreference?.hideLifeQuote && !leadPreference?.hideHealthQuote) {
                setQuoteModalStage("selectProductTypeCard");
            } else {
                setSelectedProductType(leadPreference?.hideLifeQuote ? "health" : "life");
                if (!leadPreference?.hideLifeQuote) {
                    if (IUL_FEATURE_FLAG) {
                        setQuoteModalStage("lifeQuestionCard");
                    } else {
                        setQuoteModalStage("finalExpenseIntakeFormCard");
                    }
                } else {
                    if (postalCode) {
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

                if (postalCode) {
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

    const handleSelectLifeProductType = useCallback((productType) => {
        setSelectedLifeProductType(productType);

        switch (productType) {
            case "Final Expense":
                setQuoteModalStage("finalExpenseIntakeFormCard");
                break;
            case "Indexed Universal Life":
                break;
            case "Term":
                break;
            default:
                break;
        }
    }, []);

    const handleSelectedHealthProductType = useCallback(
        (productType) => {
            setSelectedHealthProductType(productType);
            const postalCode = selectedLead?.addresses?.length > 0 ? selectedLead?.addresses[0]?.postalCode : null;
            if (postalCode) {
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
        };
    }
};

CreateNewQuoteProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
