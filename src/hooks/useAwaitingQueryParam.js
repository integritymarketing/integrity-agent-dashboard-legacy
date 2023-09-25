import { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";

function useAwaitingQueryParam() {
  const { search } = useLocation();

  const params = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  const history = useHistory();

  const deleteAwaitingParam = useCallback(() => {
    params.delete("awaiting");

    // Replace the current URL with the updated query parameters
    history.replace({
      search: params.toString(),
    });
  }, [params, history]);

  return { isAwaiting: params.get("awaiting") === "true", deleteAwaitingParam };
}

export default useAwaitingQueryParam;
