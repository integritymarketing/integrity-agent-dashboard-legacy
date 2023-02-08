import React from "react";
import ExitIcon from "components/icons/exit";
import styles from "./styles.module.scss";

const Address = ({
  item,
  setSelectedProvider,
  setSelectAddressId,
  selectAddressId,
  selectedProvider,
  address,
}) => {
  return (
    <div
      className={`${styles.address} ${
        selectAddressId === address?.id && selectedProvider?.NPI === item?.NPI
          ? styles.selected
          : ""
      }`}
    >
      <div>
        <div>
          {address
            ? [address?.streetLine1, address?.streetLine2]
                .filter(Boolean)
                .join(",")
            : null}
        </div>
        <div>
          {address
            ? [address?.city, address?.state, address?.zipCode]
                .filter(Boolean)
                .join(",")
            : null}
        </div>
      </div>

      {selectAddressId === address?.id &&
      selectedProvider?.NPI === item?.NPI ? (
        <div
          className={styles.select__close}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProvider(null);
            setSelectAddressId(null);
          }}
        >
          <ExitIcon color="#0052CE" />
        </div>
      ) : (
        <div
          className={styles.select__close}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProvider(item);
            setSelectAddressId(address?.id);
          }}
        >
          <h4 className={styles.p__h4}>Select</h4>
        </div>
      )}
    </div>
  );
};

export default Address;
