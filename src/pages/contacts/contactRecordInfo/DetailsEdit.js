import React, { useEffect, useState } from "react";
import useToast from "../../../hooks/useToast";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";

export default ({
  setDisplay,
  personalInfo,
  getContactRecordInfo,
  ...rest
}) => {
  let {
    firstName = "",
    lastName = "",
    emails = [],
    phones = [],
    addresses = [],
    contactPreferences = [],
    contactRecordType = "",
  } = personalInfo;

  let email = emails.length > 0 ? emails[0].leadEmail : "";
  let phoneData = phones.length > 0 ? phones[0] : null;
  let addressData = addresses.length > 0 ? addresses[0] : null;

  const city = addressData && addressData.city ? addressData.city : "";
  const stateCode =
    addressData && addressData.stateCode ? addressData.stateCode : "";
  const address1 =
    addressData && addressData.address1 ? addressData.address1 : "";
  const address2 =
    addressData && addressData.address2 ? addressData.address2 : "";
  const postalCode =
    addressData && addressData.postalCode ? addressData.postalCode : "";
  const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";
  const phoneLabel =
    phoneData && phoneData.phoneLabel ? phoneData.phoneLabel : "";

  const isPrimary = contactPreferences.primary
    ? contactPreferences.primary
    : "phone";

  const [state, setState] = useState({
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    phoneLabel: phoneLabel,
    city: city,
    stateCode: stateCode,
    postalCode: postalCode,
    address1: address1,
    address2: address2,
    contactRecordType: contactRecordType,
  });
  const [address2Status, setAddress2Status] = useState(false);
  const [primaryCommunication, setPrimaryCommunication] = useState(isPrimary);

  const addToast = useToast();

  const handlChange = ({ target: { name, value } }) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onUpdate = () => {
    if (emails.length > 0) {
      emails[0].leadEmail = state.email;
    } else {
      emails = [{ emailID: 0, leadEmail: state.email }];
    }
    if (phones.length > 0) {
      phones[0].leadPhone = state.phone;
      phones[0].phoneLabel = state.phoneLabel;
    } else {
      phones = [
        { phoneId: 0, phoneLabel: state.phoneLabel, leadPhone: state.phone },
      ];
    }
    if (addresses.length > 0) {
      addresses[0].address1 = state.address1;
      addresses[0].address2 = state.address2;
      addresses[0].stateCode = state.stateCode;
      addresses[0].postalCode = state.postalCode;
      addresses[0].city = state.city;
    } else {
      addresses = [
        {
          address1: state.address1,
          address2: state.address2,
          stateCode: state.stateCode,
          postalCode: state.postalCode,
          city: state.city,
        },
      ];
    }

    const payload = {
      ...personalInfo,
      firstName: state.firstName,
      lastName: state.lastName,
      emails: emails,
      phones: phones,
      addresses: addresses,
      contactRecordType: state.contactRecordType,
      primaryCommunication: primaryCommunication,
    };

    if (state.email === "" && state.phone === "") {
      addToast({
        type: "error",
        message: "Email or Phone must require, please try again",
        time: 3000,
      });
    } else {
      clientsService
        .updateLead(payload)
        .then((data) => {
          addToast({
            type: "success",
            message: "Lead successfully Updated.",
            time: 3000,
          });
          getContactRecordInfo();
        })
        .catch((e) => {
          Sentry.captureException(e);
        });
    }
  };

  useEffect(() => {
    if (state.phone === "" && state.email !== "") {
      setPrimaryCommunication("email");
    } else if (state.phone !== "" && state.email === "") {
      setPrimaryCommunication("phone");
    }
  }, [state.phone, state.email]);

  return (
    <div className="contactdetailscard">
      <ToastContextProvider>
        <div className="contactdetailscardheader">
          <h4>Contact Details</h4>
        </div>
        <div className="contactdetailscardbody">
          <div className="contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>First Name</p>
              <div className="contactdetailscardbodycolinput">
                <input
                  type="text"
                  value={state.firstName}
                  name="firstName"
                  onChange={handlChange}
                  className=""
                />
              </div>
            </div>
          </div>
          <div className="contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>Last Name</p>
              <div className="contactdetailscardbodycolinput">
                <input
                  type="text"
                  value={state.lastName}
                  name="lastName"
                  onChange={handlChange}
                  className=""
                />
              </div>
            </div>
          </div>
          <hr className="contactdetailscardborder" />
          <div className="contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>Address</p>
              <div className="contactdetailscardbodycolinput">
                <input
                  type="text"
                  value={state.address1}
                  name="address1"
                  onChange={handlChange}
                  className="zero-margin-input"
                />
              </div>
              {address2 === "" && !address2Status && (
                <div className="addaptbtn">
                  <button onClick={() => setAddress2Status(true)}>
                    + Add Apt, Suite, Unit etc.{" "}
                  </button>
                </div>
              )}
            </div>
          </div>
          {(address2 !== "" || address2Status) && (
            <div className="customMarginSpacing contactdetailscardbodyrow">
              <div className="contactdetailscardbodycol">
                <p>Apt, Suite, Unit</p>
                <div className="contactdetailscardbodycolinput">
                  <input
                    type="text"
                    value={state.address2}
                    name="address2"
                    onChange={handlChange}
                    className="zero-margin-input"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="customMarginBottomSpacing contactdetailscardbodyinputrowspacing  contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>City</p>
              <div className="contactdetailscardbodycolinput">
                <input
                  type="text"
                  value={state.city}
                  name="city"
                  onChange={handlChange}
                  className="zero-margin-input"
                />
              </div>
            </div>
            <div className="contactdetailscardbodycol">
              <p>State</p>
              <div className="contactdetailscardbodycolinput">
                <input
                  type="text"
                  value={state.stateCode}
                  name="stateCode"
                  onChange={handlChange}
                  className="custom-w-51 zero-margin-input"
                />
              </div>
            </div>
            <div className="contactdetailscardbodycol">
              <p>ZIP Code</p>
              <div className="contactdetailscardbodycolinput">
                <input
                  type="number"
                  value={state.postalCode}
                  name="postalCode"
                  onChange={handlChange}
                  className="custom-w-83 zero-margin-input"
                />
              </div>
            </div>
          </div>

          <hr className="contactdetailscardborder" />
          <div className="contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>Email Address</p>
              <div className="contactdetailscardbodycolinput">
                <input
                  type="email"
                  value={state.email}
                  name="email"
                  onChange={handlChange}
                  className="zero-margin-input"
                />
              </div>
              {state.email === "" && state.phone === "" && (
                <div style={{ color: "red" }}>
                  Email or phone is must, please provide required felds
                </div>
              )}
            </div>
          </div>
          <div className="contactdetailscardbodyrow">
            <div className="contactdetailscardbodycolradio contactdetailscardbodycol">
              <div>
                <input
                  type="radio"
                  id="test1"
                  name="radio-group"
                  disabled={state.email === ""}
                  checked={primaryCommunication === "email"}
                  onChange={() => setPrimaryCommunication("email")}
                />
                <label for="test1">Primary Communication</label>
              </div>
            </div>
          </div>
          <div className="contactdetailscardbodyrowspacing contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>Phone</p>
              <div className="contactdetailscardbodycolinput">
                <input
                  type="number"
                  value={state.phone}
                  name="phone"
                  onChange={handlChange}
                  className="custom-w-154 zero-margin-input"
                />
                {state.email === "" && state.phone === "" && (
                  <div style={{ color: "red" }}>
                    Email or phone is must, please provide required felds
                  </div>
                )}
              </div>
            </div>
            <div className="contactdetailscardbodycol">
              <p>Label</p>
              <div className="contactdetailscardbodycolinput">
                <select
                  name="phoneLabel"
                  onChange={handlChange}
                  value={state.phoneLabel}
                  className="custom-w-108 zero-margin-input"
                >
                  <option value="Phone">Phone</option>
                  <option value="Home">Home</option>
                </select>
              </div>
            </div>
          </div>
          <div className="contactdetailscardbodyrow">
            <div className="contactdetailscardbodycolradio contactdetailscardbodycol">
              <div>
                <input
                  type="radio"
                  id="test1"
                  name="radio-group"
                  disabled={state.phone === ""}
                  checked={primaryCommunication === "phone"}
                  onChange={() => setPrimaryCommunication("phone")}
                />
                <label for="test1">Primary Communication</label>
              </div>
            </div>
          </div>

          <hr className="contactdetailscardborder" />
          <div className="contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>Contact Record Type</p>
              <div className="contactdetailscardbodycolinput">
                <select
                  value={state.contactRecordType}
                  name="contactRecordType"
                  onChange={handlChange}
                  className="custom-w-148 zero-margin-input"
                >
                  <option value="Prospect">Prospect</option>
                  <option value="Client">Client</option>
                </select>
              </div>
            </div>
          </div>
          <div className="conatctdetailsbutton newnotepopupformfieldbtn form__submit custom-form-btn">
            <button
              className="cancel-btn btn"
              onClick={() => setDisplay("Details")}
            >
              Cancel
            </button>
            <button
              className={
                state.email === "" && state.phone === ""
                  ? "customdisabledbtn"
                  : "submit-btn btn"
              }
              disabled={state.email === "" && state.phone === ""}
              onClick={onUpdate}
            >
              Save
            </button>
          </div>
        </div>
      </ToastContextProvider>
    </div>
  );
};
