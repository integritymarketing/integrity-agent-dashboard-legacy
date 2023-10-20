import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as Sentry from "@sentry/react";
import useFetch from "hooks/useFetch";
import { QUOTES_API_VERSION } from "services/clientsService";

const QuotePlanList = createContext();

const performAsyncOperation = async (
  operation,
  setLoading,
  onSuccess,
  onError
) => {
  setLoading(true);
  try {
    const data = await operation();
    onSuccess(data);
  } catch (err) {
    Sentry.captureException(err);
    onError && onError(err);
  } finally {
    setLoading(false);
  }
};

export const QuotePlanListContext = () => {
  return useContext(QuotePlanList);
};

const QuotePlanListProvider = ({ children }) => {
  const URL = `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/FinalExpenses/plans/390e04ef-be95-463d-9b76-46050cbf438c`;

  // const url = `https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/FinalExpenses/plans/390e04ef-be95-463d-9b76-46050cbf438c`

  const { Get: fetchQuotePlanList } = useFetch(URL);

  const [quotePlanList, setQuotePlanList] = useState([]);
  const [quotePlanListLoading, setQuotePlanListLoading] = useState(false);

  const fetchPrescriptions = useCallback(async () => {
    await performAsyncOperation(
      fetchQuotePlanList,
      setQuotePlanListLoading,
      ({ Results = [] }) => setQuotePlanList(Results)
    );
  }, [fetchQuotePlanList]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  // New method to fetch filtered data
  const fetchFilteredQuotePlanList = useCallback(
    async (perPage, pageNumber, filterId, sortBy) => {
      const filteredURL = `?per_page=${perPage}&page=${pageNumber}&filterId=${filterId}&sort_by=${sortBy}`;

      await performAsyncOperation(
        () => fetchQuotePlanList(filteredURL),
        setQuotePlanListLoading,
        ({ Results = [] }) => setQuotePlanList(Results)
      );
    },
    [fetchQuotePlanList]
  );

  const value = {
    quotePlanList,
    quotePlanListLoading,
    fetchFilteredQuotePlanList, // Include the new method in the context value
  };

  console.log("value", value);
  return (
    <QuotePlanList.Provider value={value}>{children}</QuotePlanList.Provider>
  );
};

export default QuotePlanListProvider;
