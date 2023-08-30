import React, { useState, useEffect } from "react";
import clientsService from "services/clientsService";
import useToast from "../../../hooks/useToast";
import Spinner from "components/ui/Spinner/index";
import analyticsService from "services/analyticsService";
import ToggleSwitch from "components/ui/switch";
import { useWindowSize } from "hooks/useWindowSize";
import styles from "./preferences.module.scss";

const CommunicationPreferences = (props) => {
  const { width: windowWidth } = useWindowSize();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preference, setPreference] = useState({
    email: false,
    phone: false,
    primary: "",
    mail: false,
    dnd: false,
  });
  const addToast = useToast();

  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/agent-center/preference/",
    });
    clientsService
      .getContactPreferences(props.id)
      .then((resp) => {
        setIsLoading(false);
        if (resp) {
          setPreference(resp);
        }
        setError(null);
      })
      .catch(() => {
        setIsLoading(false);
        addToast({
          type: "error",
          message: "Error, update unsuccessful.",
          time: 3000,
        });
      });
  }, [props.id, addToast]);

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return error;
  }

  const savePreference = preference.contactPreferenceId
    ? clientsService.updateContactPreferences
    : clientsService.createContactPreferences;

  function handleChangeCheckbox(contactType, checked) {
    let req = {};
    if (contactType === "dnd") {
      req = {
        ...preference,
        email: false,
        phone: false,
        primary: "",
        sms: false,
        mail: false,
        dnd: true,
      };
    } else {
      req = {
        ...preference,
        dnd: false,
        [contactType]: !!checked,
      };
    }
    savePreference(props.id, req)
      .then((resp) => {
        setPreference(resp);
      })
      .catch(() => {
        addToast({
          type: "error",
          message: "Error, update unsuccessful.",
          time: 3000,
        });
      });
  }

  function handleChangePrimary(contactType, checked) {
    savePreference(props.id, {
      ...preference,
      [contactType?.toLowerCase()]: true,
      primary: contactType?.toLowerCase(),
    })
      .then((resp) => {
        setPreference(resp);
      })
      .catch(() => {
        addToast({
          type: "error",
          message: "Error, update unsuccessful.",
          time: 3000,
        });
      });
  }

  function isEnabled(type) {
    return !!preference[type?.toLowerCase()];
  }

  function isPrimary(type) {
    return preference.primary?.toLowerCase() === type?.toLowerCase();
  }

  const mobilePreferenceLayout = () => {
    return (
      <div className={styles.preferenceWrapper}>
        <div className={styles.preferencesContainer}>
          <div className={styles.preferenceTitle}>
            <h6>Communication Preferences</h6>
          </div>
          <div className={styles.preferenceCommunication}>
            <h2>Primary Communication</h2>
            <div className={styles.preferenceCheckbox}>
              <label>
                <input
                  type="checkbox"
                  name="primary-phone"
                  checked={isPrimary("Phone")}
                  onChange={(e) =>
                    handleChangePrimary("Phone", e.target.checked)
                  }
                />{" "}
                <span>Phone</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="primary-email"
                  checked={isPrimary("Email")}
                  onChange={(e) =>
                    handleChangePrimary("Email", e.target.checked)
                  }
                />{" "}
                <span>Email</span>
              </label>
            </div>
          </div>
          <div className={styles.preferenceSection}>
            <div className={styles.toggleSwitches}>
              <div className={styles.toggleContainer}>
                <div className={styles.toggleTxt}>Email</div>
                <div className={styles.toggleSwitcher}>
                  <ToggleSwitch
                    name="email"
                    checked={isEnabled("email")}
                    onChange={(e) =>
                      handleChangeCheckbox("email", e.target.checked)
                    }
                  />
                </div>
              </div>

              <div className={styles.toggleContainer}>
                <div className={styles.toggleTxt}>Phone</div>
                <div className={styles.toggleSwitcher}>
                  <ToggleSwitch
                    name="phone"
                    checked={isEnabled("phone")}
                    onChange={(e) =>
                      handleChangeCheckbox("phone", e.target.checked)
                    }
                  />
                </div>
              </div>

              <div className={styles.toggleContainer}>
                <div className={styles.toggleTxt}>Text Message</div>
                <div className={styles.toggleSwitcher}>
                  <ToggleSwitch
                    name="textMessage"
                    checked={isEnabled("sms")}
                    onChange={(e) =>
                      handleChangeCheckbox("sms", e.target.checked)
                    }
                  />
                </div>
              </div>

              <div className={styles.toggleContainer}>
                <div className={styles.toggleTxt}>Direct Mail</div>
                <div className={styles.toggleSwitcher}>
                  <ToggleSwitch
                    name="directMail"
                    checked={isEnabled("mail")}
                    onChange={(e) =>
                      handleChangeCheckbox("mail", e.target.checked)
                    }
                  />
                </div>
              </div>

              <div className={styles.toggleContainer}>
                <div className={styles.toggleTxt}>
                  Do Not call/ <br />
                  Lost Contact
                </div>
                <div className={styles.toggleSwitcher}>
                  <ToggleSwitch
                    name="lostContact"
                    checked={isEnabled("dnd")}
                    onChange={(e) =>
                      handleChangeCheckbox("dnd", e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {windowWidth <= 784 ? (
        mobilePreferenceLayout()
      ) : (
        <div className="contactdetailscard">
          <div className="contactdetailscardheader">
            <h4>Communication Preferences</h4>
          </div>
          <div className="contactdetailscardbody">
            <div
              className="contactdetailscardbodyrow"
              data-gtm="agent-center-preference-item-wrapper"
            >
              <div className="cpcheckboxdesign contactdetailscardbodycol">
                <div>
                  <input
                    type="checkbox"
                    id="test"
                    name="checkbox-group"
                    checked={isEnabled("email")}
                    onChange={(e) =>
                      handleChangeCheckbox("email", e.target.checked)
                    }
                  />
                  <label htmlFor="email">Direct Email</label>
                </div>
              </div>
            </div>
            <div className="contactdetailscardbodyrow">
              <div className="cpradiodesign contactdetailscardbodycolradio contactdetailscardbodycol">
                <div>
                  <input
                    type="radio"
                    id="test1"
                    name="radio-group"
                    checked={isPrimary("Email")}
                    onChange={() => handleChangePrimary("Email", true)}
                  />
                  <label htmlFor="primaryEmail">Primary Communication</label>
                </div>
              </div>
            </div>
            <hr className="contactdetailscardborder" />
            <div className="contactdetailscardbodyrow">
              <div
                className="cpcheckboxdesign contactdetailscardbodycol"
                data-gtm="agent-center-preference-item-wrapper"
              >
                <div>
                  <input
                    type="checkbox"
                    id="test"
                    name="checkbox-group"
                    checked={isEnabled("phone")}
                    onChange={(e) =>
                      handleChangeCheckbox("phone", e.target.checked)
                    }
                  />
                  <label htmlFor="phone">Phone Calls</label>
                </div>
              </div>
            </div>
            <div className="contactdetailscardbodyrow">
              <div className="cpradiodesign contactdetailscardbodycolradio contactdetailscardbodycol">
                <div>
                  <input
                    type="radio"
                    id="test1"
                    name="radio-group-phone"
                    checked={isPrimary("Phone")}
                    onChange={(e) => handleChangePrimary("Phone", true)}
                  />
                  <label htmlFor="primaryPhone">Primary Communication</label>
                </div>
              </div>
            </div>
            <hr className="contactdetailscardborder" />
            <div className="contactdetailscardbodyrow">
              <div
                className="custom-inputmargin cpcheckboxdesign contactdetailscardbodycol"
                data-gtm="agent-center-preference-item-wrapper"
              >
                <div>
                  <input
                    type="checkbox"
                    id="test"
                    name="checkbox-group"
                    checked={isEnabled("sms")}
                    onChange={(e) =>
                      handleChangeCheckbox("sms", e.target.checked)
                    }
                  />
                  <label htmlFor="sms">Text Messaging</label>
                </div>
              </div>
            </div>
            <hr className="contactdetailscardborder" />
            <div className="contactdetailscardbodyrow">
              <div
                className="custom-inputmargin cpcheckboxdesign contactdetailscardbodycol"
                data-gtm="agent-center-preference-item-wrapper"
              >
                <div>
                  <input
                    type="checkbox"
                    id="test"
                    name="checkbox-group"
                    checked={isEnabled("mail")}
                    onChange={(e) =>
                      handleChangeCheckbox("mail", e.target.checked)
                    }
                  />
                  <label htmlFor="mail">Direct Mail</label>
                </div>
              </div>
            </div>
            <hr className="contactdetailscardborder" />
            <div className="contactdetailscardbodyrow">
              <div className="custom-inputmargin cpcheckboxdesign contactdetailscardbodycol">
                <div>
                  <input
                    type="checkbox"
                    id="test"
                    name="checkbox-group"
                    checked={isEnabled("dnd")}
                    onChange={(e) =>
                      handleChangeCheckbox("dnd", e.target.checked)
                    }
                  />
                  <label htmlFor="doNotDisturb">
                    Do Not Call / Lost Contact
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommunicationPreferences;
