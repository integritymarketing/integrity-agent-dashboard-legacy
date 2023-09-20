import { useEffect, useState, useCallback } from "react";
import {
  getUniqueCarriers,
  groupUniquePlanTypesByCarrier,
  groupUniquePlanYearsByCarrier,
  convertArrayToOptions,
  groupUniqueProducerIdsByCarrier,
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

  const getProducerID = useCallback(
    (carrier) => {
      if (!carrier) return [];
      const producerIds = groupUniqueProducerIdsByCarrier(data);
      return producerIds[carrier][0];
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
    getProducerID,
  };
}

export default useSelectOptions;
