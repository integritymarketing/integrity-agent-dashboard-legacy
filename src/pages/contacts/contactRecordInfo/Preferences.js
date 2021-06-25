import React, { useState, useEffect } from "react";
import clientsService from "services/clientsService";
import useToast from "../../../hooks/useToast";
import Spinner from "components/ui/Spinner/index";
import analyticsService from "services/analyticsService";

export default (props) => {
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

  return (
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
                onClick={(e) => handleChangeCheckbox("email", e.target.checked)}
              />
              <label for="email">Direct Email</label>
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
                onClick={() => handleChangePrimary("Email", true)}
              />
              <label for="primaryEmail">Primary Communication</label>
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
                onClick={(e) => handleChangeCheckbox("phone", e.target.checked)}
              />
              <label for="phone">Phone Calls</label>
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
                onClick={(e) => handleChangePrimary("Phone", true)}
              />
              <label for="primaryPhone">Primary Communication</label>
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
                onClick={(e) => handleChangeCheckbox("sms", e.target.checked)}
              />
              <label for="sms">Text Messaging</label>
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
                onClick={(e) => handleChangeCheckbox("mail", e.target.checked)}
              />
              <label for="mail">Direct Mail</label>
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
                onClick={(e) => handleChangeCheckbox("dnd", e.target.checked)}
              />
              <label for="doNotDisturb">Do Not Call / Lost Contact</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
