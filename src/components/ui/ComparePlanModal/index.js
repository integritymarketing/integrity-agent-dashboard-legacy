import React, { useState, useMemo, useEffect, useContext } from "react";
import * as Sentry from "@sentry/react";
import { debounce } from "debounce";
import Media from "react-media";
import analyticsService from "services/analyticsService";
import plansService from "services/plansService";
import AuthContext from "contexts/auth";
import useToast from "hooks/useToast";
import Modal from "components/ui/modal";
import ComparePlansByPlanName from "components/ui/ComparePlansByPlanName";
import Radio from "components/ui/Radio";
import { Button } from "../Button";
import { Select } from "components/ui/Select";
import { formatPhoneNumber } from "utils/phones";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import "./index.scss";

const EMAIL_MOBILE_LABELS = [
  { value: "email", label: "Email" },
  { value: "mobile", label: "Mobile" },
];

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

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default ({
  modalOpen,
  handleCloseModal,
  comparePlans,
  setComparePlanModalOpen,
  handleRemovePlan,
  id,
  plansLoading,
  contactData,
}) => {
  const addToast = useToast();
  const auth = useContext(AuthContext);
  const {
    agentInfomration: { agentVirtualPhoneNumber },
  } = useAgentInformationByID();
  const {
    firstName,
    lastName,
    emails,
    phones,
    leadsId,
    addresses,
    agentNpn,
    middleName,
    birthdate,
  } = contactData;
  const leadEmail = emails?.[0]?.leadEmail ?? "";
  const leadPhone = phones?.[0]?.leadPhone ?? "";
  const [selectLabel, setSelectLabel] = useState("email");
  const [selectOption, setSelectOption] = useState("email");
  const [formattedMobile, setFormattedMobile] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [hasFocus, setFocus] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const getData = async () => {
      const user = await auth.getUser();
      setUser(user.profile);
    };
    getData();
  }, [auth, modalOpen]);

  useEffect(() => {
    if (modalOpen) {
      analyticsService.fireEvent("event-modal-appear", {
        modalName: "Compare Share Plans",
      });
    }
  }, [modalOpen]);

  const mobile = useMemo(
    () => (formattedMobile ? ("" + formattedMobile).replace(/\D/g, "") : ""),
    [formattedMobile]
  );

  const validateEmail = debounce((email) => {
    if (emailRegex.test(email)) {
      setErrors(null);
    } else {
      setErrors("Invalid email address");
    }
  }, 1000);

  const handleSetEmail = (_email) => {
    const email = _email.trim();
    setEmail(email);
    validateEmail(email);
  };

  const handleCleanUp = () => {
    setSelectOption("email");
    setEmail("");
    setErrors("");
    setFormattedMobile("");
    setUser({});
    setSelectLabel("email");
    handleCloseModal();
  };
  const handleShareComparePlans = async () => {
    const agentFirstName = user?.firstName;
    const agentLastName = user?.lastName;
    const agentEmail = user?.email;
    const roles = user?.roles ?? "";
    const agentPhoneNumber = agentVirtualPhoneNumber;
    const zipCode = addresses[0]?.postalCode;
    const stateCode = addresses[0]?.stateCode;
    const countyFIPS = addresses[0]?.countyFips;
    const urlPathName = window.location.pathname;
    const origin = window.location.origin;
    const planCompareUrl = `${origin}/customer${urlPathName}`;
    let updatedRoles;
    if (typeof roles === "string") {
      updatedRoles = [roles];
    } else {
      updatedRoles = roles;
    }
    try {
      let payload = {
        leadFirstName: firstName,
        leadLastName: lastName,
        agentFirstName: agentFirstName,
        agentLastName: agentLastName,
        agentPhoneNumber: agentPhoneNumber,
        agentEmail: agentEmail,
        planCompareUrl,
        leadId: `${leadsId}`,
        agentNpn,
        zipCode,
        state: stateCode,
        countyFIPS,
        middleInitial: middleName === "" ? null : middleName,
        dateOfBirth: birthdate,
        roles: updatedRoles,
      };
      if (selectOption === "email") {
        const data = {
          ...payload,
          messageDestination: leadEmail,
          messageType: "email",
        };
        await plansService.sendPlanCompare(data);
      } else if (selectOption === "textMessage") {
        const data = {
          ...payload,
          messageDestination: leadPhone,
          messageType: "sms",
        };
        await plansService.sendPlanCompare(data);
      } else {
        if (selectLabel === "email") {
          const data = {
            ...payload,
            messageDestination: email,
            messageType: "email",
          };
          await plansService.sendPlanCompare(data);
        } else {
          const data = {
            ...payload,
            messageDestination: mobile,
            messageType: "sms",
          };
          await plansService.sendPlanCompare(data);
        }
      }
      addToast({
        message: "Plans sent to client",
      });
    } catch (error) {
      Sentry.captureException(error);
      addToast({
        type: "error",
        message: "Failed to share plan",
      });
    } finally {
      handleCleanUp();
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

  return (
    <Media
      queries={{
        mobile: "(min-width: 320px) and (max-width: 480px)",
      }}
    >
      {(matches) => (
        <>
          {modalOpen && (
            <Modal
              size="xlg"
              wide={true}
              open={true}
              cssClassName={"shareplan-modal"}
              onClose={handleCloseModal}
              labeledById="sharePlan_label"
              descById="sharePlan_desc"
            >
              <div className="shareplan-modal dialog--container">
                <div className="dialog--title ">
                  <h2
                    id="dialog_help_label"
                    className="hdg hdg--2 mb-1 mble-title"
                  >
                    Share Plans
                  </h2>
                </div>
                <div>
                  <ComparePlansByPlanName
                    comparePlans={comparePlans}
                    setComparePlanModalOpen={setComparePlanModalOpen}
                    handleRemovePlan={handleRemovePlan}
                    id={id}
                    plansLoading={plansLoading}
                    isModal={true}
                    contactData={contactData}
                  />
                </div>
                <div className={"shareplan-label"}>
                  How do you want to share this plan?
                </div>
                <div className="select-scope-radios">
                  <Radio
                    id="email"
                    data-gtm="input-share-plans"
                    htmlFor="email"
                    label={`Email (${leadEmail})`}
                    name="share-plan"
                    value="email"
                    checked={selectOption === "email"}
                    onChange={(event) =>
                      setSelectOption(event.currentTarget.value)
                    }
                  />
                  <Radio
                    id="textMessage"
                    data-gtm="input-share-plans"
                    htmlFor="textMessage"
                    label={`Text Message (${__formatPhoneNumber(leadPhone)})`}
                    name="share-plan"
                    value="textMessage"
                    checked={selectOption === "textMessage"}
                    onChange={(event) =>
                      setSelectOption(event.currentTarget.value)
                    }
                  />
                  <Radio
                    id="newEmailOrMobile"
                    data-gtm="input-share-plans"
                    htmlFor="newEmailOrMobile"
                    label="New email or mobile number"
                    name="share-plan"
                    value="newEmailOrMObile"
                    checked={selectOption === "newEmailOrMObile"}
                    onChange={(event) =>
                      setSelectOption(event.currentTarget.value)
                    }
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
                          autocomplete="on"
                          type="text"
                          data-gtm="input-share-plans"
                          onFocus={() => setFocus(true)}
                          onBlur={() => setFocus(false)}
                          placeholder={hasFocus ? "" : "Enter email"}
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
                          data-gtm="input-share-plans"
                          onFocus={() => setFocus(true)}
                          onBlur={() => setFocus(false)}
                          placeholder={hasFocus ? "" : "XXX-XXX-XXXX"}
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
                <div className={"footer"}>
                  <Button
                    label="Share"
                    data-gtm="button-share"
                    onClick={handleShareComparePlans}
                    disabled={idFormNotValid}
                  />
                  <Button
                    fullWidth={matches.mobile}
                    data-gtm="button-cancel"
                    label={"Cancel"}
                    onClick={handleCloseModal}
                    type="secondary"
                  />
                </div>
              </div>
            </Modal>
          )}
        </>
      )}
    </Media>
  );
};
