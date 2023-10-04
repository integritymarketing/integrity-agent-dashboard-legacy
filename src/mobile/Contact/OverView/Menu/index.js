import React, { useRef } from "react";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import view from "./Images/view.png";
import contact from "./Images/contact.png";
import settings from "./Images/settings.png";
import DownArrow from "./Icons/downArrow";
import styles from "./styles.module.scss";
import SOAIcon from "./Images/icon-SOA.png";

const MobileMenu = ({
  handleDisplay,
  handleViewPlans,
  setMenuToggle,
  menuToggle,
  display,
}) => {
  const ref = useRef();
  const DATA = [
    {
      name: "overview",
      displayName: "Overview",
      img: view,
    },
    {
      name: "details",
      displayName: "Details",
      img: contact,
    },
    {
      name: "scopeofappointments",
      displayName: "Scope of Appointments",
      img: SOAIcon,
    },
    {
      name: "preferences",
      displayName: "Preferences",
      img: settings,
    },
  ];

  useOnClickOutside(ref, () => {
    setMenuToggle(false);
  });

  const selected =
    DATA.filter((item) => item.name === display)?.[0] || DATA[0];

  return (
    <div ref={ref}>
      <div className={styles.menuContainer}>
        <div
          className={styles.selected}
          onClick={() => setMenuToggle(!menuToggle)}
        >
          <div className={styles.row}>
            <div className={styles.icon}>
              <img
                alt={selected.name}
                className={styles[selected.name]}
                src={selected.img}
              />
            </div>
            <div className={styles.name}>{selected?.displayName}</div>
          </div>
          <div className={styles.icon}>
            <DownArrow />
          </div>
        </div>
        {menuToggle && (
          <div className={styles.contentCenter}>
            <div className={styles.optionsContainer}>
              <div className={styles.options}>
                {DATA &&
                  DATA.map((item) => (
                    <div
                      className={`${styles.row} ${
                        display === item.name ? styles.selectedItem : ""
                      }`}
                      onClick={() => handleDisplay(item.name)}
                    >
                      <div className={styles.icon}>
                        {" "}
                        <img
                          alt={item.name}
                          className={styles[item.name]}
                          src={item.img}
                        />
                      </div>
                      <div className={styles.name}>{item.displayName}</div>
                    </div>
                  ))}
              </div>
              <div className={styles.buttonContainer}>
                {handleViewPlans(true)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
