import React, { useState } from "react";
import Arrow from "components/icons/down";
import styles from "./styles.module.scss";
import Address from "./Address";

const ProviderCard = ({
  item,
  selectedProvider,
  index,
  setSelectedProvider,
  setSelectAddressId,
  selectAddressId,
}) => {
  const [isOpen, setOpenToggle] = useState(false);
  return (
    <div
      className={`${styles.card} ${
        selectedProvider?.NPI === item?.NPI ? styles.selected : ""
      } ${index > 0 ? "mt-2" : ""}`}
    >
      <div className={styles.details}>
        <div className={styles.name}>{item?.presentationName}</div>
        <div className={styles.role}> {item?.specialty} </div>{" "}
      </div>
      {item && item?.addresses?.length >= 0 && (
        <Address
          address={item?.addresses?.[0]}
          item={item}
          setSelectedProvider={setSelectedProvider}
          setSelectAddressId={setSelectAddressId}
          selectAddressId={selectAddressId}
          selectedProvider={selectedProvider}
        />
      )}
      {item && item?.addresses?.length > 1 && (
        <div className={styles.all__address}>
          <div className={styles.header__address}>
            <div
              className={styles.p__h4}
              onClick={() => setOpenToggle(!isOpen)}
            >
              Additional Locations ({item?.addresses?.length - 1})
            </div>
            <div
              className={`${styles.select__close} ${
                isOpen ? styles.reverse : ""
              }`}
              onClick={() => setOpenToggle(!isOpen)}
            >
              <Arrow color="#0052CE" />
            </div>
          </div>
          {isOpen &&
            item?.addresses?.map((address, a_index) => {
              return (
                <>
                  {a_index > 0 && (
                    <div>
                      <Address
                        address={address}
                        item={item}
                        setSelectedProvider={setSelectedProvider}
                        setSelectAddressId={setSelectAddressId}
                        selectAddressId={selectAddressId}
                        selectedProvider={selectedProvider}
                      />
                    </div>
                  )}
                </>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ProviderCard;
