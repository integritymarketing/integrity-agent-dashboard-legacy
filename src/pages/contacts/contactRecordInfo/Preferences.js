import React, { useState, useEffect } from "react";
import clientsService from "services/clientsService";
import useToast from "../../../hooks/useToast";
import Spinner from "./../../../components/ui/Spinner/index";

export default (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preference, setPreference] = useState([]);
  const addToast = useToast();

  useEffect(() => {
    clientsService
      .getContactPreferences(props.id)
      .then((resp) => {
        setIsLoading(false);
        if (resp) {
          setPreference([resp]);
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

  function handleChangeCheckbox(contactType, checked) {
    const pref =
      preference.find(({ contactType: type }) => contactType === type) || {};
    clientsService
      .updateContactPreferences(props.id, {
        ...pref,
        leadsId: props.id,
        contactType: checked ? contactType : null,
        isPrimary: false,
      })
      .then((resp) => {
        setPreference((prevPrefs) => {
          if (contactType === "DND" && checked) {
            return [resp];
          }
          const filteredPrefs = prevPrefs.filter(
            (fil) =>
              fil.contactType !== contactType && fil.contactType !== "DND"
          );

          if (checked) {
            filteredPrefs.push(resp);
          }

          return filteredPrefs;
        });
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
    const pref =
      preference.find(({ contactType: type }) => contactType === type) || {};
    clientsService
      .updateContactPreferences(props.id, {
        ...pref,
        leadsId: props.id,
        contactType,
        isPrimary: true,
      })
      .then((resp) => {
        setPreference((prevPrefs) => {
          const filteredPrefs = prevPrefs
            .filter(
              (fil) =>
                fil.contactType !== contactType && fil.contactType !== "DND"
            )
            .map((fil) => ({ ...fil, isPrimary: false }));

          filteredPrefs.push(resp);

          return filteredPrefs;
        });
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
    return !!preference.find(({ contactType }) => contactType === type);
  }

  function isPrimary(type) {
    const pref = preference.find(({ contactType }) => contactType === type);
    return !!(pref && pref.isPrimary);
  }

  return (
    <div className="contactdetailscard">
      <div className="contactdetailscardheader">
        <h4>Communication Preferences</h4>
      </div>
      <div className="contactdetailscardbody">
        <div className="contactdetailscardbodyrow">
          <div className="cpcheckboxdesign contactdetailscardbodycol">
            <div>
              <input
                type="checkbox"
                id="test"
                name="checkbox-group"
                checked={isEnabled("Email")}
                onClick={(e) => handleChangeCheckbox("Email", e.target.checked)}
              />
              <label for="email">Email</label>
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
          <div className="cpcheckboxdesign contactdetailscardbodycol">
            <div>
              <input
                type="checkbox"
                id="test"
                name="checkbox-group"
                checked={isEnabled("Phone")}
                onClick={(e) => handleChangeCheckbox("Phone", e.target.checked)}
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
          <div className="custom-inputmargin cpcheckboxdesign contactdetailscardbodycol">
            <div>
              <input
                type="checkbox"
                id="test"
                name="checkbox-group"
                checked={isEnabled("Text")}
                onClick={(e) => handleChangeCheckbox("Text", e.target.checked)}
              />
              <label for="test">Text Messaging</label>
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
                checked={isEnabled("Mail")}
                onClick={(e) => handleChangeCheckbox("Mail", e.target.checked)}
              />
              <label for="mail">Mail</label>
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
                checked={isEnabled("DND")}
                onClick={(e) => handleChangeCheckbox("DND", e.target.checked)}
              />
              <label for="doNotDisturb">Do Not Call / Lost Contact</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
