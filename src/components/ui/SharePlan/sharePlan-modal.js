import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
} from "react";
import * as Sentry from "@sentry/react";
import { debounce } from "debounce";
import Media from "react-media";
import AuthContext from "contexts/auth";
import plansService from "services/plansService";
import useToast from "hooks/useToast";
import Modal from "components/ui/modal";
import CompactPlanCard from "../PlanCard/compact";
import Radio from "components/ui/Radio";
import { Button } from "../Button";
import { Select } from "components/ui/Select";
import { formatPhoneNumber } from "utils/phones";
import "./styles.scss";

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

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default ({
  modalOpen,
  planData = {},
  handleCloseModal,
  contact = {},
}) => {
  const addToast = useToast();
  const auth = useContext(AuthContext);

  const { firstName, lastName, emails, phones, leadsId } = contact;
  const { planRating, id, documents } = planData;
  const leadEmail = emails?.[0]?.leadEmail ?? "";
  const leadPhone = phones?.[0]?.leadPhone ?? "";
  const [selectLabel, setSelectLabel] = useState("email");
  const [selectOption, setSelectOption] = useState(null);
  const [formattedMobile, setFormattedMobile] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [user, setUser] = useState({});
  const [hasFocus, setFocus] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const user = await auth.getUser();
      setUser(user.profile);
    };
    getData();
  }, [auth]);

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
  }, 5000);

  const handleSetEmail = (_email) => {
    const email = _email.trim();
    setEmail(email);
    validateEmail(email);
  };

  const summaryBenfitURL = () => {
    const result = documents.map((d) => ({ key: d.name, value: d.url }));
    return result;
  };

  const enroll = async () => {
    const agentFirstName = user?.firstName;
    const agentLastName = user?.lastName;
    const agentEmail = user?.email;
    const agentPhoneNumber = user?.phone;
    try {
      let payload = {
        leadFirstName: firstName,
        leadLastName: lastName,
        agentFirstName: agentFirstName,
        agentLastName: agentLastName,
        agentPhoneNumber: agentPhoneNumber,
        agentEmail: agentEmail,
        documentationLinks: summaryBenfitURL(),
        starRatingsLink: planRating.toString(),
      };
      if (selectOption === "email") {
        const data = {
          ...payload,
          messageDestination: leadEmail,
          messageType: "email",
        };
        await plansService.sendPlan(data, leadsId, id);
      } else if (selectOption === "textMessage") {
        const data = {
          ...payload,
          messageDestination: leadPhone,
          messageType: "sms",
        };
        await plansService.sendPlan(data, leadsId, id);
      } else {
        if (selectLabel === "email") {
          const data = {
            ...payload,
            messageDestination: email,
            messageType: "email",
          };
          await plansService.sendPlan(data, leadsId, id);
        } else {
          const data = {
            ...payload,
            messageDestination: mobile,
            messageType: "sms",
          };
          await plansService.sendPlan(data, leadsId, id);
        }
      }
      addToast({
        message: "Sucessfully shared plan",
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to share plan",
      });
    } finally {
      setSelectOption("");
      setEmail("email");
      setErrors("");
      setFormattedMobile("");
      setUser({});
      handleCloseModal();
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
              size="lg"
              open={true}
              wide
              cssClassName={"shareplan-modal"}
              onClose={() => handleCloseModal()}
              labeledById="sharePlan_label"
              descById="sharePlan_desc"
            >
              <div className="shareplan-modal dialog--container">
                <div className="dialog--title ">
                  <h2
                    id="dialog_help_label"
                    className="hdg hdg--2 mb-1 mble-title"
                  >
                    Share this Plan
                  </h2>
                </div>
                {planData && <CompactPlanCard planData={planData} />}
                <div className={"shareplan-label"}>
                  How do you want to share this plan?
                </div>
                <div className="select-scope-radios">
                  <Radio
                    id="email"
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
                      initialValue="email"
                      providerModal={true}
                      onChange={setSelectLabel}
                      showValueAlways={true}
                    />
                    {selectLabel === "email" && (
                      <div className="email-mobile-section">
                        <input
                          type="text"
                          onFocus={() => setFocus(true)}
                          onBlur={() => setFocus(false)}
                          placeholder={hasFocus ?  '' : "Enter email"}
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
                <div className={"footer"}>
                  <Button
                    label="Share"
                    onClick={enroll}
                    disabled={idFormNotValid}
                  />
                  <Button
                    fullWidth={matches.mobile}
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
