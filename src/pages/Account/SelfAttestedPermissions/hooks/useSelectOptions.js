import { useEffect, useState, useCallback } from "react";
import {
  getUniqueCarriers,
  groupUniquePlanTypesByCarrier,
  groupUniquePlanYearsByCarrier,
  convertArrayToOptions,
} from "../utils/helper";

function useSelectOptions(data) {
  const [carriersOptions, setCarriersOptions] = useState([]);

  const getProductsOptions = useCallback(
    (carrier) => {
      if (!carrier) return [];
      const uniquePlanTypesByCarrier = groupUniquePlanTypesByCarrier(data);
      return convertArrayToOptions(uniquePlanTypesByCarrier[carrier]);
    },
    [data]
  );

  const getPlanYearOptions = useCallback(
    (carrier) => {
      if (!carrier) return [];
      const planYearsByCarrier = groupUniquePlanYearsByCarrier(data);
      return convertArrayToOptions(planYearsByCarrier[carrier]);
    },
    [data]
  );

  useEffect(() => {
    setCarriersOptions(convertArrayToOptions(getUniqueCarriers(data)));
  }, [data]);

  return {
    carriersOptions,
    getProductsOptions,
    getPlanYearOptions,
  };
}

export default useSelectOptions;
