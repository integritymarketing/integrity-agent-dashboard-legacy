export const formatAddress = (address) => {
  if (address?.length > 0) {
    const { address1, address2, city, stateCode, postalCode } = address?.[0];
    const formattedAddress = [address1, address2, city, stateCode, postalCode]
      .filter(Boolean)
      .join(", ");
    return formattedAddress;
  } else return "N/A";
};

export const getMapUrl = () => {
  if (
    navigator.platform.indexOf("iPhone") !== -1 ||
    navigator.platform.indexOf("iPod") !== -1 ||
    navigator.platform.indexOf("iPad") !== -1
  ) {
    return "maps://maps.google.com/maps";
  } else {
    return "https://maps.google.com/maps";
  }
};

export const STATES = [
  { value: "AL", label: "AL-Alabama" },
  { value: "AK", label: "AK-Alaska" },
  { value: "AS", label: "AS-American Samoa" },
  { value: "AZ", label: "AZ-Arizona" },
  { value: "AR", label: "AR-Arkansas" },
  { value: "CA", label: "CA-California" },
  { value: "CO", label: "CO-Colorado" },
  { value: "CT", label: "CT-Connecticut" },
  { value: "DE", label: "DE-Delaware" },
  { value: "DC", label: "DC-District Of Columbia" },
  { value: "FL", label: "FL-Florida" },
  { value: "GA", label: "GA-Georgia" },
  { value: "GU", label: "GU-Guam" },
  { value: "HI", label: "HI-Hawaii" },
  { value: "ID", label: "ID-Idaho" },
  { value: "IL", label: "IL-Illinois" },
  { value: "IN", label: "IN-Indiana" },
  { value: "IA", label: "IA-Iowa" },
  { value: "KS", label: "KS-Kansas" },
  { value: "KY", label: "KY-Kentucky" },
  { value: "LA", label: "LA-Louisiana" },
  { value: "ME", label: "ME-Maine" },
  { value: "MH", label: "MH-Marshall Islands" },
  { value: "MD", label: "MD-Maryland" },
  { value: "MA", label: "MA-Massachusetts" },
  { value: "MI", label: "MI-Michigan" },
  { value: "MN", label: "MN-Minnesota" },
  { value: "MS", label: "MS-Mississippi" },
  { value: "MO", label: "MO-Missouri" },
  { value: "MT", label: "MT-Montana" },
  { value: "NE", label: "NE-Nebraska" },
  { value: "NV", label: "NV-Nevada" },
  { value: "NH", label: "NH-New Hampshire" },
  { value: "NJ", label: "NJ-New Jersey" },
  { value: "NM", label: "NM-New Mexico" },
  { value: "NY", label: "NY-New York" },
  { value: "NC", label: "NC-North Carolina" },
  { value: "ND", label: "ND-North Dakota" },
  { value: "MP", label: "NP-Northern Mariana Islands" },
  { value: "OH", label: "OH-Ohio" },
  { value: "OK", label: "OK-Oklahoma" },
  { value: "OR", label: "OR-Oregon" },
  { value: "PW", label: "Palau" },
  { value: "PA", label: "PA-Pennsylvania" },
  { value: "PR", label: "PR-Puerto Rico" },
  { value: "RI", label: "RI-Rhode Island" },
  { value: "SC", label: "SC-South Carolina" },
  { value: "SD", label: "SD-South Dakota" },
  { value: "TN", label: "TN-Tennessee" },
  { value: "TX", label: "TX-Texas" },
  { value: "VI", label: "VI-US Virgin Islands" },
  { value: "UT", label: "UT-Utah" },
  { value: "VT", label: "VT-Vermont" },
  { value: "VA", label: "VA-Virginia" },
  { value: "WA", label: "WA-Washington" },
  { value: "WV", label: "WV-West Virginia" },
  { value: "WI", label: "WI-Wisconsin" },
  { value: "WY", label: "WY-Wyoming" },
];

export const sortAddressesBySelectedIds = (addresses, ids) => {
  if (!addresses || !ids || addresses?.length === 0 || ids?.length === 0)
    return;
  return addresses.sort((a, b) => {
    const aIsPriority = ids.includes(a.id);
    const bIsPriority = ids.includes(b.id);

    if (aIsPriority && !bIsPriority) {
      return -1;
    }
    if (!aIsPriority && bIsPriority) {
      return 1;
    }
    return 0;
  });
};

export const arraysAreEqual = (arr1, arr2) => {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;

  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  for (let i = 0; i < arr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) return false;
  }
  return true;
};
