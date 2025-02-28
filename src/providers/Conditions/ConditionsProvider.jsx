import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";
import { QUOTES_API_VERSION } from "services/clientsService";
import performAsyncOperation from "utilities/performAsyncOperation";

export const ConditionsContext = createContext();

export const ConditionsProvider = ({ children }) => {
    const URL_V3 = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Underwriting/medication/search`;
    const URL_V4 = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Underwriting/healthcondition/search`;
    const POST_HEALTH_CONDITIONS = `${
        import.meta.env.VITE_QUOTE_URL
    }/api/${QUOTES_API_VERSION}/HealthCondition/Lead/SaveMultiple`;
    const GET_HEALTH_CONDITIONS_QUESTIONS = `${
        import.meta.env.VITE_QUOTE_URL
    }/api/${QUOTES_API_VERSION}/Underwriting/healthcondition/questions`;
    const UPDATE_HEALTH_CONDITIONS_QUESTIONS = `${
        import.meta.env.VITE_QUOTE_URL
    }/api/${QUOTES_API_VERSION}/Underwriting/healthcondition/questions`;
    const GET_HEALTH_CONDITIONS = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/HealthCondition/Lead`;

    const { Get: searchHealthConditions, loading: searchHealthConditionsLoading } = useFetch(URL_V3);
    const { Get: getPrescriptionConditions, loading: getPrescriptionConditionsLoading } = useFetch(URL_V4);

    const { Post: postHealthConditions, loading: postHealthConditionsLoading } = useFetch(POST_HEALTH_CONDITIONS);
    const {
        Get: getHealthConditionsQuestions,
        loading: getHealthConditionsQuestionsLoading,
        data: getHealthConditionsQuestionsData,
    } = useFetch(GET_HEALTH_CONDITIONS_QUESTIONS);
    const { Patch: updateHealthConditionsQuestions, loading: updateHealthConditionsQuestionsLoading } = useFetch(
        UPDATE_HEALTH_CONDITIONS_QUESTIONS
    );

    const { Post: updateHealthConditionsQuestionsPostCall, isLoading: updateHealthConditionsQuestionsPostCallLoading } =
        useFetch(UPDATE_HEALTH_CONDITIONS_QUESTIONS);
    const {
        Get: getHealthConditions,
        loading: getHealthConditionsLoading,
        data: getHealthConditionsData,
    } = useFetch(GET_HEALTH_CONDITIONS);

    const [prescriptionConditions, setPrescriptionConditions] = useState([]);
    const [healthConditionsQuestions, setHealthConditionsQuestions] = useState([]);

    const showToast = useToast();

    const fetchHealthConditions = useCallback(
        async (leadId) => {
            try {
                const path = `${leadId}`;
                await getHealthConditions(null, false, path);
            } catch (error) {
                console.log("error", error);
                showToast({ type: "error", message: "Failed to search health conditions" });
            }
        },
        [getHealthConditions]
    );

    const fetchSearchHealthConditions = useCallback(
        async (healthCondition) => {
            try {
                const path = `${encodeURIComponent(healthCondition)}`;
                return await searchHealthConditions(null, false, path);
            } catch (error) {
                console.log("error", error);
                showToast({ type: "error", message: "Failed to search health conditions" });
            }
        },
        [searchHealthConditions, showToast]
    );

    const fetchPrescriptionConditions = useCallback(
        async (prescription) => {
            try {
                const path = `MED/${prescription}`;
                let data = await getPrescriptionConditions(null, false, path);
                setPrescriptionConditions(data?.uwConditions || []);
            } catch (error) {
                console.log("error", error);
                showToast({ type: "error", message: "Failed to get the prescription conditions" });
            }
        },
        [getPrescriptionConditions, showToast]
    );

    const addHealthConditions = useCallback(
        async (healthConditions, leadId) => {
            if (!leadId) {
                return;
            }
            const path = `${leadId}`;
            await performAsyncOperation(
                () => postHealthConditions(healthConditions, false, path),
                () => {},
                async () => {
                    showToast({ message: "Health Conditions Applied" });
                    await fetchHealthConditionsQuestions(leadId);
                }
            );
        },
        [postHealthConditions]
    );

    const fetchHealthConditionsQuestions = useCallback(
        async (leadId) => {
            try {
                const path = `${leadId}`;
                let data = await getHealthConditionsQuestions(null, false, path);
                setHealthConditionsQuestions(data);
            } catch (error) {
                console.log("error", error);
                showToast({ type: "error", message: "Failed to get the health conditions questions" });
            }
        },
        [getHealthConditionsQuestions, showToast]
    );

    const fetchHealthConditionsQuestionsByCondtionId = useCallback(async (leadId, conditionId) => {
        try {
            const path = `${leadId}/condition/${conditionId}`;
            let data = await getHealthConditionsQuestions(null, false, path);
            setHealthConditionsQuestions(data);
        } catch (error) {
            console.log("error", error);
            showToast({ type: "error", message: "Failed to get the health conditions questions" });
        }
    }, []);

    const updateHealthConditionsQuestion = useCallback(
        async (payload, leadId) => {
            try {
                let path = `${leadId}`;
                return await updateHealthConditionsQuestions(payload, false, path);
            } catch (error) {
                console.log("error", error);
                showToast({ type: "error", message: "Failed to update the health conditions questions" });
            }
        },
        [updateHealthConditionsQuestions, showToast]
    );

    const updateHealthConditionsQuestionsPost = useCallback(
        async (payload, leadId) => {
            try {
                let path = `${leadId}`;
                return await updateHealthConditionsQuestionsPostCall(payload, false, path);
            } catch (error) {
                console.log("error", error);
                showToast({ type: "error", message: "Failed to update the health conditions questions" });
            }
        },
        [updateHealthConditionsQuestionsPostCall, showToast]
    );

    const handleHealthConditionClose = useCallback(() => {
        setPrescriptionConditions([]);
    }, []);

    const clearConditionalQuestionData = useCallback(() => {
        setHealthConditionsQuestions([]);
    }, []);

    const contextValue = useMemo(
        () => ({
            fetchSearchHealthConditions,
            searchHealthConditionsLoading,
            fetchPrescriptionConditions,
            getPrescriptionConditionsLoading,
            prescriptionConditions,
            addHealthConditions,
            handleHealthConditionClose,
            healthConditionsQuestions,
            clearConditionalQuestionData,
            updateHealthConditionsQuestion,
            updateHealthConditionsQuestionsLoading,
            getHealthConditionsQuestionsLoading,
            fetchHealthConditions,
            getHealthConditionsLoading,
            getHealthConditionsData,
            updateHealthConditionsQuestionsPost,
            updateHealthConditionsQuestionsPostCallLoading,
            postHealthConditionsLoading,
            fetchHealthConditionsQuestionsByCondtionId,
            getHealthConditionsQuestionsData,
        }),
        [
            fetchSearchHealthConditions,
            searchHealthConditionsLoading,
            fetchPrescriptionConditions,
            getPrescriptionConditionsLoading,
            prescriptionConditions,
            addHealthConditions,
            handleHealthConditionClose,
            healthConditionsQuestions,
            clearConditionalQuestionData,
            updateHealthConditionsQuestion,
            updateHealthConditionsQuestionsLoading,
            getHealthConditionsQuestionsLoading,
            fetchHealthConditions,
            getHealthConditionsLoading,
            getHealthConditionsData,
            updateHealthConditionsQuestionsPost,
            updateHealthConditionsQuestionsPostCallLoading,
            postHealthConditionsLoading,
            fetchHealthConditionsQuestionsByCondtionId,
            getHealthConditionsQuestionsData,
            getHealthConditionsQuestionsLoading,
        ]
    );
    return <ConditionsContext.Provider value={contextValue}>{children}</ConditionsContext.Provider>;
};

ConditionsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
