import React, { useState, useEffect, useContext } from "react";
import { useHistory, Link, useParams, useLocation } from "react-router-dom";
import { parseISO } from "date-fns";
import { Helmet } from "react-helmet-async";
import { Formik, Form, Field } from "formik";
import { Button } from "components/ui/Button";
import Container from "components/ui/container";
import Textfield from "components/ui/textfield";
import Warning from "components/icons/warning";
import { Select } from "components/ui/Select";
import validationService from "services/validationService";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import styles from "./ContactsPage.module.scss";
import clientService from "../../services/clientsService";
import useToast from "../../hooks/useToast";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import { formatPhoneNumber } from "utils/phones";
import { formatDate } from "utils/dates";
import PhoneLabels from "utils/phoneLabels";
import ContactRecordTypes from "utils/contactRecordTypes";
import analyticsService from "services/analyticsService";
import {
  onlyAlphabets,
  formatMbiNumber,
} from "utils/shared-utils/sharedUtility";
import CountyContext from "contexts/counties";
import callRecordingsService from "services/callRecordingsService";
import useQueryParams from "hooks/useQueryParams";
import DatePickerMUI from "components/DatePicker";
import enrollPlansService from "services/enrollPlansService";

const isDuplicateContact = async (values, setDuplicateLeadIds, errors = {}) => {
  if (Object.keys(errors).length) {
    return {
      ...errors,
      isExactDuplicate: true,
    };
  } else {
    const response = await clientService.getDuplicateContact(values);
    if (response.ok) {
      const resMessage = await response.json();
      if (resMessage.isExactDuplicate) {
        return {
          firstName: "Duplicate Contact",
          lastName: "Duplicate Contact",
          isExactDuplicate: true,
        };
      } else {
        setDuplicateLeadIds(resMessage.duplicateLeadIds || []);
      }
      return errors;
    } else {
      // TODO: handle errors
      return {
        isExactDuplicate: true,
      };
    }
  }
};

const NewContactForm = ({
  callLogId,
  firstName,
  lastName,
  state,
  medicareBeneficiaryID = "",
}) => {
  const { get } = useQueryParams();
  const callFrom = get("callFrom");
  const isRelink = get("relink") === "true";
  const [showAddress2, setShowAddress2] = useState(false);
  const [duplicateLeadIds, setDuplicateLeadIds] = useState([]);
  const {
    allCounties = [],
    allStates = [],
    doFetch,
  } = useContext(CountyContext);

  const history = useHistory();
  const addToast = useToast();

  const getContactLink = (id) => `/contact/${id}/details`;
  const goToContactDetailPage = (id) => {
    // if (duplicateLeadIds.length) {
    //   return history.push(
    //     getContactLink(id).concat(`/duplicate/${duplicateLeadIds[0]}`)
    //   );
    // }
    history.push(getContactLink(id));
  };
  const goToContactPage = () => {
    history.push("/contacts");
  };
  const handleMultileDuplicates = () => {
    if (duplicateLeadIds.length) {
      window.localStorage.setItem(
        "duplicateLeadIds",
        JSON.stringify(duplicateLeadIds)
      );
    }
    return true;
  };

  useEffect(() => {
    doFetch(""); // eslint-disable-next-line
  }, []);

  const linkContact = async (leadIdParam) => {
    const {
      state: { policyId, agentNpn, policyStatus, firstName, lastName },
    } = state;

    try {
      const updateBusinessBookPayload = {
        agentNpn: agentNpn,
        leadId: leadIdParam.toString(),
        policyNumber: policyId,
        consumerFirstName: firstName,
        consumerLastName: lastName,
        leadDate: new Date(),
        leadStatus: policyStatus,
      };
      const response = await enrollPlansService.updateBookOfBusiness(
        updateBusinessBookPayload
      );
      if (response) {
        setTimeout(() => {
          addToast({
            message: "Contact linked successfully",
          });
        }, 2000);
      }
    } catch (error) {
      addToast({
        type: "error",
        message: `${error.message}`,
        time: 4000,
      });
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: firstName,
        lastName: lastName,
        middleName: "",
        email: "",
        birthdate: "",
        phones: {
          leadPhone: callFrom?.replace("1", "") || "",
          phoneLabel: "mobile",
        },
        address: {
          address1: "",
          address2: "",
          city: "",
          stateCode: "",
          postalCode: "",
          county: "",
          countyFips: "",
        },
        medicareBeneficiaryID: formatMbiNumber(medicareBeneficiaryID),
        partA: null,
        partB: null,
        primaryCommunication: "",
        contactRecordType: "prospect",
      }}
      validate={async (values) => {
        const errors = validationService.validateMultiple(
          [
            {
              name: "firstName",
              validator: validationService.validateName,
              args: ["First Name"],
            },
            {
              name: "lastName",
              validator: validationService.validateName,
              args: ["Last Name"],
            },
            {
              name: "birthdate",
              validator: validationService.validateDateInput,
              args: ["Date of Birth", "MM/dd/yyyy"],
            },

            {
              name: "phones.leadPhone",
              validator: validationService.composeValidator([
                validationService.validateRequiredIf(
                  "phone" === values.primaryCommunication
                ),
                validationService.validatePhone,
              ]),
            },
            {
              name: "email",
              validator: validationService.composeValidator([
                validationService.validateRequiredIf(
                  "email" === values.primaryCommunication
                ),
                validationService.validateEmail,
              ]),
            },
            {
              name: "address.postalCode",
              validator: validationService.composeValidator([
                validationService.validatePostalCode,
              ]),
            },
            {
              name: "address.address1",
              validator: validationService.composeValidator([
                validationService.validateAddress,
              ]),
              args: ["Address"],
            },
            {
              name: "address.address2",
              validator: validationService.composeValidator([
                validationService.validateAddress,
              ]),
              args: ["Apt, Suite, Unit"],
            },
            {
              name: "address.city",
              validator: validationService.composeValidator([
                validationService.validateAddress,
              ]),
              args: ["City"],
            },
            {
              name: "medicareBeneficiaryID",
              validator: validationService.validateMedicalBeneficiaryId,
              args: ["Medicare Beneficiary ID Number"],
            },
          ],
          values
        );
        return await isDuplicateContact(values, setDuplicateLeadIds, errors);
      }}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        setSubmitting(true);
        let response = await clientService.addNewContact(values);
        if (response.ok) {
          const resMessage = await response.json();
          const leadId = resMessage.leadsId;
          analyticsService.fireEvent("event-form-submit", {
            formName: "New Contact",
          });
          if (callLogId !== "undefined" && callLogId) {
            await callRecordingsService.assignsLeadToInboundCallRecord({
              callLogId,
              leadId,
            });
          }
          addToast({
            message: "Contact added successfully",
          });
          if (isRelink) {
            await linkContact(leadId);
          }
          setTimeout(() => {
            goToContactDetailPage(leadId);
            setSubmitting(false);
          }, 4000);
        } else if (response.status === 400) {
          const errMessage = await response.json();
          const duplicateLeadId = (errMessage.split(":")[1] || "").trim();
          setErrors({
            duplicateLeadId,
            firstName: "Duplicate Contact",
            lastName: "Duplicate Contact",
          });
          analyticsService.fireEvent("event-form-submit-invalid", {
            formName: "Duplicate Contact Error",
          });
          document.getElementsByTagName("html")[0].scrollIntoView();
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        dirty,
        submitCount,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => {
        let primaryCommunicationStatus = false;
        if (
          !errors.phones?.leadPhone &&
          touched.phones?.leadPhone &&
          touched.email &&
          !errors.email &&
          values.email !== "" &&
          values.phones?.leadPhone !== "" &&
          values.primaryCommunication === ""
        ) {
          primaryCommunicationStatus = true;
        }
        let countyName = allCounties[0]?.value;
        let countyFipsName = allCounties[0]?.key;
        let stateCodeName = allStates[0]?.value;

        if (
          allCounties.length === 1 &&
          countyName !== values.address.county &&
          countyFipsName !== values.address.countyFips
        ) {
          setFieldValue("address.county", allCounties[0].value);
          setFieldValue("address.countyFips", allCounties[0].key);
        }
        if (
          allStates.length === 1 &&
          stateCodeName !== values.address.stateCode
        ) {
          setFieldValue("address.stateCode", allStates[0].value);
        }
        return (
          <Form className="form mt-3">
            <fieldset className="form__fields form__fields--constrained hide-input-err">
              <Textfield
                id="contact-fname"
                label="First Name"
                placeholder={"Enter first name"}
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  (touched.firstName || submitCount > 0) && errors.firstName
                    ? true
                    : false
                }
              />
              {(touched.firstName || submitCount > 0) && errors.firstName && (
                <ul className="details-edit-custom-error-msg">
                  <li className="error-msg-red">{errors.firstName}</li>
                </ul>
              )}

              <Textfield
                id="contact-mname"
                label="Middle Initial"
                placeholder="Enter middle initial"
                name="middleName"
                onKeyPress={onlyAlphabets}
                maxLength="1"
                value={values.middleName?.toUpperCase()}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Textfield
                id="contact-lname"
                label="Last Name"
                placeholder="Enter last name"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  (touched.lastName || submitCount > 0) && errors.lastName
                    ? true
                    : false
                }
              />
              {(touched.lastName || submitCount > 0) && errors.lastName && (
                <ul className="details-edit-custom-error-msg">
                  <li className="error-msg-red">{errors.lastName}</li>
                </ul>
              )}
              <div className="custom-w-186  contact-details-col1 mob-res-w-100">
                <label className=" custom-label-state label">Birthdate</label>

                <DatePickerMUI
                  value={values.birthdate}
                  disableFuture={true}
                  onChange={(value) => {
                    setFieldValue("birthdate", formatDate(value));
                  }}
                  className={styles.disableDatePickerError}
                />

                {errors.birthdate && (
                  <ul className="details-edit-custom-error-msg">
                    <li className="error-msg-red">{errors.birthdate}</li>
                  </ul>
                )}
              </div>
            </fieldset>
            <div className="mt-3 mb-3 border-bottom border-bottom--light" />
            <fieldset className="custom-form-fields form__fields form__fields--constrained  hide-input-err">
              <Textfield
                id="contact-address"
                className={`${styles["contact-address"]}`}
                label="Address"
                placeholder={"Enter address"}
                name="address.address1"
                value={values.address.address1}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  (touched.address?.address1 || submitCount > 0) &&
                  errors.address?.address1
                    ? true
                    : false
                }
              />
              {(touched.address?.address1 || submitCount > 0) &&
                errors.address?.address1 && (
                  <ul className="details-edit-custom-error-msg">
                    <li className="error-msg-red">
                      {errors.address?.address1}
                    </li>
                  </ul>
                )}
              {!showAddress2 && (
                <h4
                  className="address--2"
                  onClick={() => setShowAddress2(true)}
                >
                  + Add Apt, Suite, Unit etc.
                </h4>
              )}
              {showAddress2 && (
                <>
                  <Textfield
                    id="contact-address2"
                    className={`${styles["contact-address"]}`}
                    label="Apt, Suite, Unit"
                    placeholder={"Enter Apt, Suite, Unit"}
                    name="address.address2"
                    value={values.address.address2}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched.address?.address2 || submitCount > 0) &&
                      errors.address?.address2
                        ? true
                        : false
                    }
                  />
                  {(touched.address?.address2 || submitCount > 0) &&
                    errors.address?.address2 && (
                      <ul className="details-edit-custom-error-msg">
                        <li className="error-msg-red">
                          {errors.address?.address2}
                        </li>
                      </ul>
                    )}
                </>
              )}
              <div
                className="address__city__state__zip hide-input-err"
                style={{ display: "flex" }}
              >
                <Textfield
                  id="contact-address__city"
                  className={`${styles["contact-address--city"]} mr-1`}
                  label="City"
                  name="address.city"
                  value={values.address.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    (touched.address?.city || submitCount > 0) &&
                    errors.address?.city
                      ? true
                      : false
                  }
                />

                <Textfield
                  id="contact-address__zip"
                  className={`${styles["contact-address--zip"]}`}
                  label="ZIP Code"
                  name="address.postalCode"
                  inputprops={{ maxLength: 5 }}
                  value={values.address.postalCode}
                  onChange={(e) => {
                    setFieldValue("address.postalCode", e.target.value);
                    setFieldValue("address.county", "");
                    setFieldValue("address.stateCode", "");
                    doFetch(e.target.value);
                  }}
                  onBlur={handleBlur}
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .toString()
                      .slice(0, 5);
                  }}
                  error={
                    (touched.address?.postalCode || submitCount > 0) &&
                    errors.address?.postalCode
                      ? true
                      : false
                  }
                />
                <div className="ml-10">
                  <label className="label" htmlFor="phone-label">
                    State
                  </label>
                  <div className="state-select-input">
                    <Select
                      placeholder="select"
                      showValueAsLabel={true}
                      className={`${styles["contact-address--statecode"]} `}
                      options={allStates}
                      initialValue={values.address.stateCode}
                      isDefaultOpen={
                        allStates.length > 1 && values.address.stateCode === ""
                          ? true
                          : false
                      }
                      onChange={(value) =>
                        setFieldValue("address.stateCode", value)
                      }
                      showValueAlways={true}
                    />
                  </div>
                </div>

                <div className="mob-res-mt-29 ml-10 custom-w-25 contact-details-col1">
                  <label
                    className=" custom-label-state label"
                    htmlFor="phone-label"
                  >
                    County
                  </label>
                  <div className="record-select-input mob-res-mar-0">
                    <Select
                      placeholder="select"
                      showValueAsLabel={true}
                      className={`${styles["contact-address--statecode"]} `}
                      options={allCounties}
                      initialValue={values.address.county}
                      isDefaultOpen={
                        allCounties.length > 1 && values.address.county === ""
                          ? true
                          : false
                      }
                      onChange={(value) => {
                        setFieldValue("address.county", value);
                        const fip = allCounties.filter(
                          (item) => item.value === value
                        )[0]?.key;
                        setFieldValue("address.countyFips", fip);
                      }}
                      showValueAlways={true}
                    />
                  </div>
                </div>
              </div>
              {(touched.address?.city || submitCount > 0) &&
                errors.address?.city && (
                  <ul className="details-edit-custom-error-msg">
                    <li className="error-msg-red">{errors.address?.city}</li>
                  </ul>
                )}

              {errors.address?.postalCode &&
                (touched.address?.postalCode || submitCount > 0) && (
                  <ul className="details-edit-custom-error-msg">
                    <li className="error-msg-red zip-code-error-msg ">
                      {errors.address?.postalCode}
                    </li>
                  </ul>
                )}
            </fieldset>
            <div className="mt-3 mb-3 border-bottom border-bottom--light" />
            <fieldset className="form__fields form__fields--constrained ">
              <Textfield
                id="contact-email"
                type="email"
                label="Email Address"
                placeholder="Enter email address"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
              />
              <div>
                <Field
                  className="mr-1"
                  type="radio"
                  id="primary--email"
                  name="primaryCommunication"
                  value="email"
                />
                <label htmlFor="primary--email">Primary Communication</label>
              </div>
              <div style={{ display: "flex" }}>
                <Textfield
                  className="mr-2"
                  id="contact-phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="(XXX) XXX-XXXX"
                  name="phones.leadPhone"
                  value={formatPhoneNumber(values.phones.leadPhone) || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phones?.leadPhone && errors.phones?.leadPhone}
                />
                <div>
                  <label className="label" htmlFor="phone-label">
                    Label
                  </label>
                  <Select
                    options={PhoneLabels}
                    style={{ width: "140px" }}
                    initialValue="mobile"
                    onChange={(value) =>
                      setFieldValue("phones.phoneLabel", value)
                    }
                    showValueAlways={true}
                  />
                </div>
              </div>
              <div>
                <Field
                  className="mr-1"
                  type="radio"
                  id="primary--phone"
                  name="primaryCommunication"
                  value="phone"
                />
                <label htmlFor="primary--phone">Primary Communication</label>
              </div>
            </fieldset>
            <div className="mt-3 mb-3 border-bottom border-bottom--light" />
            <fieldset className="form__fields">
              <div style={{ width: "22.5rem" }}>
                <Textfield
                  id="mbi-number"
                  type="text"
                  label="Medicare Beneficiary ID Number"
                  placeholder="MBI Number"
                  name="medicareBeneficiaryID"
                  value={values.medicareBeneficiaryID}
                  onChange={handleChange}
                  onBlur={(e) => {
                    handleBlur(e);
                    setFieldValue(
                      "medicareBeneficiaryID",
                      formatMbiNumber(values.medicareBeneficiaryID)
                    );
                  }}
                />

                {errors?.medicareBeneficiaryID && (
                  <ul className="details-edit-custom-error-msg">
                    <li className="error-msg-red">
                      {errors?.medicareBeneficiaryID}
                    </li>
                  </ul>
                )}
              </div>

              <div style={{ display: "flex" }}>
                <div
                  className="custom-w-186  contact-details-col1 mob-res-w-100"
                  style={{ marginRight: "70px" }}
                >
                  <label className=" custom-label-state label">
                    Part A Effective Date
                  </label>

                  <DatePickerMUI
                    value={values.partA}
                    onChange={(value) => {
                      setFieldValue("partA", formatDate(value, "yyyy-MM-dd"));
                    }}
                    className={styles.disableDatePickerError}
                  />
                </div>
                <div className="custom-w-186  contact-details-col1 mob-res-w-100">
                  <label className=" custom-label-state label">
                    Part B Effective Date
                  </label>

                  <DatePickerMUI
                    value={values.partB === null ? "" : values.partB}
                    onChange={(value) => {
                      setFieldValue("partB", formatDate(value, "yyyy-MM-dd"));
                    }}
                    className={styles.disableDatePickerError}
                    minDate={parseISO(values.partA)}
                  />
                </div>
              </div>
            </fieldset>
            {primaryCommunicationStatus && (
              <ul className="details-edit-custom-error-msg ">
                <li className="error-msg-red primary-error-msg ">
                  Please choose the primary communication type
                </li>
              </ul>
            )}
            <div className="mt-3 mb-3 border-bottom border-bottom--light" />
            <div>
              <label className="label" htmlFor="contact--record--type">
                Contact Record Type
              </label>
              <Select
                style={{ width: 146 }}
                options={ContactRecordTypes}
                initialValue="prospect"
                onChange={(value) => {
                  analyticsService.fireEvent("event-content-load", {
                    selection: `record type ${value}`,
                  });
                  setFieldValue("contactRecordType", value);
                }}
                showValueAlways={true}
              />

              {duplicateLeadIds?.length > 0 && (
                <div className={`${styles["duplicate-lead"]} mt-5 mb-4`}>
                  <div>
                    <Warning />
                  </div>
                  <div className={`${styles["duplicate-lead--text"]} pl-1`}>
                    You can create this contact, but the entry is a potential
                    duplicate to{" "}
                    {duplicateLeadIds.length === 1 ? (
                      <a
                        href={getContactLink(duplicateLeadIds[0])}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`this contact link`}
                      </a>
                    ) : (
                      <Link
                        to="/contacts"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleMultileDuplicates}
                      >
                        {" "}
                        view duplicates
                      </Link>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-5 pb-5" style={{ display: "flex" }}>
                <Button
                  className="mr-2"
                  data-gtm="new-contact-cancel-button"
                  label="Cancel"
                  type="secondary"
                  onClick={goToContactPage}
                />
                <Button
                  data-gtm="new-contact-create-button"
                  label="Create Contact"
                  type="primary"
                  disabled={!dirty || !isValid || primaryCommunicationStatus}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default function AddNewContactPage() {
  const { callLogId } = useParams();
  const { state } = useLocation();

  const { policyHolder } = state?.state ?? {};
  let firstName = "";
  let lastName = "";

  if (policyHolder) {
    const splitName = policyHolder?.split(" ");
    firstName = splitName[0];
    lastName = splitName[1];
  }

  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/new-contact/",
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Add new contact</title>
      </Helmet>
      <GlobalNav />
      <div className="v2">
        <Container
          id="main-content"
          className={`mt-4 add--new-contact new--contact-err ${styles["add--new-contact"]}`}
        >
          <ToastContextProvider>
            <h3 className="hdg hdg--3 pt-3 pl-3 pb-2">Contact Details</h3>
            <div className="border-bottom border-bottom--light"></div>
            <NewContactForm
              callLogId={callLogId}
              firstName={firstName}
              lastName={lastName}
              state={state}
            />
          </ToastContextProvider>
        </Container>
      </div>
      <GlobalFooter />
    </>
  );
}
