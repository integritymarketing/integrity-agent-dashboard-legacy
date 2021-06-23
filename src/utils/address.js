export const formatAddress = (address) => {
  if (address) {
    const { address1, address2, city, stateCode, postalCode } = address;
    const formattedAddress = [address1, address2, city, stateCode, postalCode]
      .filter(Boolean)
      .join(", ");
    return formattedAddress;
  } else return "N/A";
};
