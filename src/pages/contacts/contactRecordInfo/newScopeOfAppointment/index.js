import React, { useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Media from "react-media";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import Container from "components/ui/container";
import Card from "components/ui/card";
import Radio from "components/ui/Radio";
import { Button } from "components/ui/Button";
import { Select } from "components/ui/Select";
import BackNavContext from "contexts/backNavProvider";
import ContactContext from "contexts/contacts";
import clientsService from "services/clientsService";
import analyticsService from "services/analyticsService";
import { formatPhoneNumber } from "utils/phones";
import useUserProfile from "hooks/useUserProfile";
import "./index.scss";
import Track from "./Track";
import ArrowForwardWithCircle from "components/SharedModals/Icons/ArrowForwardWithCirlce";

export const __formatPhoneNumber = (phoneNumberString) => {
  const originalInput = phoneNumberString;
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  if (cleaned === "") {
    return null;
  }

  return originalInput;
};

const EMAIL_MOBILE_LABELS = [
  { value: "email", label: "Email" },
  { value: "mobile", label: "Mobile" },
];
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const NewScopeOfAppointment = ({ leadId, onCloseModal }) => {
  const addToast = useToast();
  const { newSoaContactDetails, setNewSoaContactDetails } =
    useContext(ContactContext);
  const { setCurrentPage } = useContext(BackNavContext);
  const agentUserProfile = useUserProfile();
  const [selectLabel, setSelectLabel] = useState("email");
  const [selectOption, setSelectOption] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [formattedMobile, setFormattedMobile] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");

  useEffect(() => {
    const getContactInfo = async () => {
      try {
        const data = await clientsService.getContactInfo(leadId);
        setNewSoaContactDetails(data);
      } catch (err) {
        addToast({
          type: "error",
          message: "Failed to load lead information",
        });
      }
    };
    if (!newSoaContactDetails?.firstName && leadId) {
      getContactInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newSoaContactDetails, leadId]);
  useEffect(() => {
    setCurrentPage("Scope of Appointment Page");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    firstName,
    lastName,
    emails = [],
    phones,
    leadsId,
  } = newSoaContactDetails;
  const agentFirstName = agentUserProfile?.firstName;
  const agentLastName = agentUserProfile?.lastName;
  const agentEmail = agentUserProfile?.email;
  const agentPhoneNumber = agentUserProfile?.phone;
  const npnNumber = agentUserProfile?.npn;
  const leadEmail = emails?.[0]?.leadEmail ?? "";
  const leadPhone = phones?.[0]?.leadPhone ?? "";

  const validateEmail = (email) => {
    if (emailRegex.test(email)) {
      setErrors(null);
    } else {
      setErrors("Invalid email address");
    }
  };

  const handleSetEmail = (_email) => {
    const email = _email.trim();
    setEmail(email);
    validateEmail(email);
  };

  const mobile = useMemo(
    () => (formattedMobile ? ("" + formattedMobile).replace(/\D/g, "") : ""),
    [formattedMobile]
  );

  const handleSend = async () => {
    try {
      let payload = {
        leadFirstName: firstName,
        leadLastName: lastName,
        agentFirstName: agentFirstName,
        agentLastName: agentLastName,
        agentPhoneNumber: agentPhoneNumber,
        agentEmail: agentEmail,
        agentNpn: npnNumber,
        isTracking48HoursWaitingPeroid: isTracking,
      };
      if (selectOption === "email") {
        const data = {
          ...payload,
          messageDestination: leadEmail,
          messageType: "email",
        };
        await clientsService.sendSoaInformation(data, leadsId);
      } else if (selectOption === "textMessage") {
        const data = {
          ...payload,
          messageDestination: leadPhone,
          messageType: "sms",
        };
        await clientsService.sendSoaInformation(data, leadsId);
      } else {
        if (selectLabel === "email") {
          const data = {
            ...payload,
            messageDestination: email,
            messageType: "email",
          };
          await clientsService.sendSoaInformation(data, leadsId);
        } else {
          const data = {
            ...payload,
            messageDestination: mobile,
            messageType: "sms",
          };
          await clientsService.sendSoaInformation(data, leadsId);
        }
      }
      onCloseModal();
      addToast({
        message: "Scope of Appointment sent",
      });
      analyticsService.fireEvent("event-form-submit-valid", {
        formName: "New Scope Appointment",
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to send Scope of Appointment",
      });
    }
  };

  const idFormNotValid = useMemo(() => {
    if (selectOption === "newEmailOrMObile") {
      return selectLabel === "mobile"
        ? Boolean(mobile.length !== 10)
        : !emailRegex.test(email);
    }
    return !selectOption;
  }, [selectOption, selectLabel, mobile, email]);

  const getRadioElement = (key, value) => {
    return (
      <div>
        <span style={{ color: "#052A63", fontWeight: "bold" }}>{key}: </span>{" "}
        <span style={{ color: "#434A51" }}>{value}</span>
      </div>
    );
  };

  return (
    <Media
      queries={{
        mobile: "(min-width: 320px) and (max-width: 480px)",
      }}
    >
      {(matches) => (
        <>
          <Container className="new-sop-page">
            <Card className="new-scope-card">
              <div>
                <section className="select-scope-wrapper">
                  <div className="select-scope-heading pb-10">
                    Please select where you would like to send the SOA:
                  </div>
                  <div className="select-scope-radios">
                    {leadEmail && (
                      <Radio
                        id="email"
                        htmlFor="email"
                        className={`${
                          selectOption === "email" ? "highlight " : ""
                        } pb-10 radio-label`}
                        label={getRadioElement("Email", leadEmail)}
                        name="new-soa"
                        value="email"
                        checked={selectOption === "email"}
                        onChange={(event) =>
                          setSelectOption(event.target.value)
                        }
                      />
                    )}
                    {leadPhone && (
                      <Radio
                        id="textMessage"
                        htmlFor="textMessage"
                        className={`${
                          selectOption === "textMessage" ? "highlight " : ""
                        } pb-10 radio-label`}
                        label={getRadioElement(
                          "Text Message",
                          __formatPhoneNumber(leadPhone)
                        )}
                        name="new-soa"
                        value="textMessage"
                        checked={selectOption === "textMessage"}
                        onChange={(event) =>
                          setSelectOption(event.target.value)
                        }
                      />
                    )}
                    <Radio
                      id="newEmailOrMobile"
                      htmlFor="newEmailOrMobile"
                      className={`${
                        selectOption === "newEmailOrMObile" ? "highlight " : ""
                      } pb-10 radio-label`}
                      label="New Email Or Mobile Number"
                      name="new-soa"
                      value="newEmailOrMObile"
                      checked={selectOption === "newEmailOrMObile"}
                      onChange={(event) => setSelectOption(event.target.value)}
                    />
                  </div>
                  {selectOption === "newEmailOrMObile" && (
                    <div className="new-email-or-mobile">
                      <Select
                        className="mr-2"
                        options={EMAIL_MOBILE_LABELS}
                        style={{ width: "140px" }}
                        initialValue={selectLabel}
                        providerModal={true}
                        onChange={setSelectLabel}
                        showValueAlways={true}
                      />
                      {selectLabel === "email" && (
                        <div className="email-mobile-section">
                          <input
                            type="text"
                            placeholder="Enter email"
                            value={email}
                            className={`${errors && "error-class"} text-input`}
                            onChange={(e) => {
                              handleSetEmail(e.currentTarget.value);
                            }}
                          />
                          {errors && (
                            <span className="validation-msg">{errors}</span>
                          )}
                        </div>
                      )}
                      {selectLabel === "mobile" && (
                        <div className="email-mobile-section">
                          <input
                            type="text"
                            placeholder="XXX-XXX-XXXX"
                            value={formattedMobile}
                            maxLength="10"
                            className={`${
                              mobile.length !== 10 && mobile.length !== 0
                                ? "error-class"
                                : ""
                            } text-input`}
                            onChange={(e) => {
                              setFormattedMobile(
                                formatPhoneNumber(
                                  e.currentTarget.value.replace(/\D/g, "")
                                )
                              );
                            }}
                          />
                          {mobile.length !== 10 && mobile.length !== 0 && (
                            <span className="validation-msg">
                              Invalid mobile number
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </div>
              <Track onCheckChange={setIsTracking} />
            </Card>
            <div
              className="send-button"
              style={{ pointerEvents: idFormNotValid ? "none" : "initial" }}
            >
              <Button
                fullWidth={matches.mobile}
                label="Send SOA"
                icon={
                  <span style={{ marginLeft: "10px", marginRight: "-10px" }}>
                    <ArrowForwardWithCircle />
                  </span>
                }
                iconPosition="right"
                onClick={!idFormNotValid && handleSend}
                data-gtm="button-send"
              />
            </div>
          </Container>
        </>
      )}
    </Media>
  );
};

NewScopeOfAppointment.propTypes = {
  leadId: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};

export default NewScopeOfAppointment;
