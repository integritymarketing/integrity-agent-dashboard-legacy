import { useEffect, useState, useCallback } from "react";
import {
  getUniqueCarriers,
  groupUniquePlanTypesByCarrier,
  groupUniquePlanYearsByCarrier,
  convertArrayToOptions,
  groupUniqueProducerIdsByCarrier,
  groupCarriers,
} from "../utils/helper";

function useSelectOptions(data) {
  const [carriersGroup, setCarriersGroup] = useState({});
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
    const uniqueCarriersData = getUniqueCarriers(data);
    const groupCarriersData = groupCarriers(data);
    setCarriersOptions(convertArrayToOptions(uniqueCarriersData));
    setCarriersGroup(groupCarriersData);
  }, [data]);

  return {
    carriersOptions,
    getProductsOptions,
    getPlanYearOptions,
    getProducerID,
    carriersGroup,
  };
}

export default useSelectOptions;
