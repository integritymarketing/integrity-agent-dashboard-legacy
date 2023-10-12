import { useCallback, useMemo } from "react";
import {  useLocation, useNavigate } from "react-router-dom";

function useAwaitingQueryParam() {
  const { search } = useLocation();

  const params = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  const navigate = useNavigate();

  const deleteAwaitingParam = useCallback(() => {
    params.delete("awaiting");

    navigate(`?${params.toString()}`, { replace: true });
  }, [params, navigate]);

  return { isAwaiting: params.get("awaiting") === "true", deleteAwaitingParam };
}

export default useAwaitingQueryParam;
