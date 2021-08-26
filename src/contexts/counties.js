import React, { createContext, useState } from "react";
import clientsService from "services/clientsService";

const CountyContext = createContext();

export const CountyProvider = (props) => {
  const [allCounties, setAllCounties] = useState([]);

  const doFetch = async (zipcode) => {
    if (zipcode.length === 5) {
      const counties = (await clientsService.getCounties(zipcode)) || [];
      const all_Counties = counties?.map((county) => ({
        value: county.countyName,
        label: county.countyName,
        key: county.countyFIPS,
      }));
      setAllCounties([...all_Counties]);
    } else {
      setAllCounties([]);
    }
  };

  return (
    <CountyContext.Provider
      value={{ allCounties: allCounties, doFetch: (zip) => doFetch(zip) }}
      {...props}
    />
  );
};

export default CountyContext;
