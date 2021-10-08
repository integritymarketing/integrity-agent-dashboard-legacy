import React, { useState, useEffect, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Button } from "components/ui/Button";
import Textfield from "components/ui/textfield";
import Warning from "components/icons/warning";
import { Select } from "components/ui/Select";
import validationService from "services/validationService";
import styles from "../ContactsPage.module.scss";
import clientService from "../../../services/clientsService";
import useToast from "../../../hooks/useToast";
import { formatPhoneNumber } from "utils/phones";
import { formatDate } from "utils/dates";
import { STATES } from "utils/address";
import PhoneLabels from "utils/phoneLabels";
import ContactRecordTypes from "utils/contactRecordTypes";
import analyticsService from "services/analyticsService";
import { onlyAlphabets } from "utils/shared-utils/sharedUtility";
import CountyContext from "contexts/counties";

const isDuplicateContact = async (
  values,
  setDuplicateLeadIds,
  errors = {},
  leadsId
) => {
  if (Object.keys(errors).length) {
    return {
      ...errors,
      isExactDuplicate: true,
    };
  } else {
    const response = await clientService.getDuplicateContact(values);
    if (response.ok) {
      const resMessage = await response.json();
      const duplicateLeadIds = resMessage.duplicateLeadIds.filter(
        (id) => leadsId !== id
      );

      if (duplicateLeadIds.length > 0) {
        if (resMessage.isExactDuplicate) {
          return {
            firstName: "Duplicate Contact",
            lastName: "Duplicate Contact",
            isExactDuplicate: true,
          };
        } else {
          setDuplicateLeadIds(duplicateLeadIds || []);
        }
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

export default (props) => {
  let {
    firstName = "",
    middleName = "",
    lastName = "",
    birthdate,
    emails = [],
    phones = [],
    addresses = [],
    contactPreferences,
    contactRecordType = "prospect",
    leadsId,
    leadStatusId,
    notes,
  } = props.personalInfo;

  let { allCounties = [], doFetch } = useContext(CountyContext);
  let email = emails.length > 0 ? emails[0].leadEmail : null;
  let phoneData = phones.length > 0 ? phones[0] : null;
  let addressData = addresses.length > 0 ? addresses[0] : null;
  const emailID = emails.length > 0 ? emails[0].emailID : 0;
  const leadAddressId =
    addressData && addressData.leadAddressId ? addressData.leadAddressId : 0;
  const phoneId = phoneData && phoneData.phoneId ? phoneData.phoneId : 0;

  const city = addressData && addressData.city ? addressData.city : "";
  const stateCode =
    addressData && addressData.stateCode ? addressData.stateCode : "";
  const address1 =
    addressData && addressData.address1 ? addressData.address1 : "";
  const address2 =
    addressData && addressData.address2 ? addressData.address2 : "";
  const county = addressData && addressData.county ? addressData.county : "";
  const countyFips =
    addressData && addressData.countyFips ? addressData.countyFips : "";
  const postalCode =
    addressData && addressData.postalCode ? addressData.postalCode : "";
  const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";
  const phoneLabel =
    phoneData && phoneData.phoneLabel ? phoneData.phoneLabel : "mobile";

  const isPrimary = contactPreferences?.primary
    ? contactPreferences?.primary
    : "email";

  const addToast = useToast();
  const [duplicateLeadIds, setDuplicateLeadIds] = useState([]);

  const history = useHistory();

  const getContactLink = (id) => `/contact/${id}`;
  const goToContactDetailPage = (id) => {
    if (duplicateLeadIds.length) {
      return history.push(
        getContactLink(id).concat(`/duplicate/${duplicateLeadIds[0]}`)
      );
    }
    history.push(getContactLink(id));
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
    doFetch(postalCode); // eslint-disable-next-line
  }, []);

  return (
    <Formik
      initialValues={{
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        email: email,
        birthdate: birthdate ? formatDate(birthdate) : "",
        phones: {
          leadPhone: phone,
          phoneLabel: phoneLabel?.toLowerCase(),
        },
        address: {
          address1: address1,
          address2: address2,
          city: city,
          stateCode: stateCode,
          postalCode: postalCode,
          county: county || "",
          countyFips: countyFips,
        },
        primaryCommunication: isPrimary,
        contactRecordType: contactRecordType?.toLowerCase(),
        emailID,
        leadAddressId,
        phoneId,
        leadStatusId,
        leadsId,
        notes,
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
            },
            {
              name: "birthdate",
              validator: validationService.validateDateInput,
              args: ["Date of Birth", "MM/dd/yyyy"],
            },
          ],
          values
        );
        return await isDuplicateContact(
          values,
          setDuplicateLeadIds,
          errors,
          leadsId
        );
      }}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        debugger;
        setSubmitting(true);
        let response = await clientService.updateLead(values);
        if (response.ok) {
          props.getContactRecordInfo();
          if (props.successNavigationRoute) {
            history.push(props.successNavigationRoute);
          } else {
            goToContactDetailPage(leadsId);
          }
          props.setEdit(false);
          setSubmitting(false);
          addToast({
            message: "Contact updated successfully",
          });
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
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => {
        let countyName = allCounties[0]?.value;
        let countyFipsName = allCounties[0]?.key;
        if (
          allCounties.length === 1 &&
          countyName !== values.address.county &&
          countyFipsName !== values.address.countyFips
        ) {
          setFieldValue("address.county", allCounties[0].value);
          setFieldValue("address.countyFips", allCounties[0].key);
        }
        return (
          <>
            <div className="scope-details-card-header contactdetailscardheader">
              <h4>Contact Details</h4>

              <div className="" style={{ display: "flex" }}>
                <Button
                  className="edit-contact-details-cancel-btn contact-details-cancel cancel-btn btn mr-2 ml-10"
                  data-gtm="new-contact-cancel-button"
                  label="Cancel"
                  onClick={() => props.setEdit(false)}
                />
                <Button
                  className={`contact-details-submit submit-btn btn ${
                    !dirty || !isValid ? "btn-disabled" : ""
                  }`}
                  data-gtm="new-contact-create-button"
                  label="Save Changes"
                  disabled={!dirty || !isValid}
                  onClick={handleSubmit}
                />
              </div>
            </div>
            <div className="contactdetailscardbody">
              <Form className="details-edit-form form">
                <div className="contact-details-row mobile-responsive-row">
                  <div className="custom-w-186 contact-details-col1">
                    <Textfield
                      id="contact-fname"
                      label="First Name"
                      placeholder={"Enter first name"}
                      name="firstName"
                      className="hide-field-error"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.firstName ? true : false}
                    />
                    {touched.firstName && errors.firstName && (
                      <ul className="details-edit-custom-error-msg">
                        <li className="error-msg-red">{errors.firstName}</li>
                      </ul>
                    )}
                  </div>
                  <div className="ml-65 res-middle-initial custom-w-25 contact-details-col1">
                    <Textfield
                      id="contact-mname"
                      type="text"
                      label="Middle Initial"
                      placeholder=""
                      maxLength="1"
                      name="middleName"
                      onKeyPress={onlyAlphabets}
                      value={values.middleName?.toUpperCase()}
                      className="custom-mob-w custom-w-px"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="custom-w-25 contact-details-col1 mob-res-margin">
                    <Textfield
                      id="contact-lname"
                      label="Last Name"
                      placeholder="Enter last name"
                      className="hide-field-error"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.lastName ? true : false}
                    />
                    {touched.lastName && errors.lastName && (
                      <ul className="details-edit-custom-error-msg">
                        <li className="error-msg-red">{errors.lastName}</li>
                      </ul>
                    )}
                  </div>
                  <div className="responsive-display contact-details-col1 mob-res-w-100">
                    <Textfield
                      id="contact-birthdate"
                      type="text"
                      label="Date of Birth"
                      placeholder="MM/DD/YYYY"
                      name="birthdate"
                      value={values.birthdate}
                      className="custom-w-px1"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.birthdate && errors.birthdate}
                    />
                  </div>
                </div>
                <div className="mob-email-row contact-details-row mob-res-row1">
                  <div className="custom-w-186 responsive-d-none contact-details-col1 mob-res-w-100">
                    <Textfield
                      id="contact-birthdate"
                      type="text"
                      label="Date of Birth"
                      placeholder="MM/DD/YYYY"
                      name="birthdate"
                      value={values.birthdate}
                      className="custom-w-px1"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.birthdate && errors.birthdate}
                    />
                  </div>
                  <div className="ml-65 responsive-w-50 custom-w-25 contact-details-col1">
                    <label
                      className="custom-label-state label"
                      htmlFor="phone-label"
                    >
                      Contact Record Type
                    </label>
                    <div className="record-select-input mob-res-mar-0">
                      <Select
                        options={ContactRecordTypes}
                        initialValue={values.contactRecordType}
                        onChange={(value) =>
                          setFieldValue("contactRecordType", value)
                        }
                      />
                    </div>
                  </div>
                  <div className="custom-w-25 contact-details-col1 visibility-hidden"></div>
                </div>
                <div className="mob-email-row contact-details-row mob-res-row1">
                  <div className="contact-details-col1 mob-res-w-100">
                    <Textfield
                      id="contact-email"
                      type="email"
                      label="E-Mail"
                      placeholder="Enter your email address"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && errors.email}
                    />

                    <label
                      htmlFor="primary--phone"
                      className="primary-communication-edit-label"
                    >
                      <Field
                        type="radio"
                        className="mr-1"
                        id="primary--email"
                        name="primaryCommunication"
                        value="email"
                      />
                      Primary Communication
                    </label>
                  </div>
                  <div className="responsive-inline">
                    <div className=" w-50 custom-w-25 contact-details-col1  mobile-phone-input">
                      <Textfield
                        id="contact-phone"
                        label="Phone Number"
                        type="tel"
                        placeholder="(   )_ _ _  - _ _ _ _ "
                        name="phones.leadPhone"
                        value={formatPhoneNumber(values.phones.leadPhone)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.phones?.leadPhone && errors.phones?.leadPhone
                        }
                      />

                      <label
                        htmlFor="primary--phone"
                        className="primary-communication-edit-label"
                      >
                        <Field
                          type="radio"
                          className="mr-1"
                          id="primary--phone"
                          name="primaryCommunication"
                          value="phone"
                        />
                        Primary Communication
                      </label>
                    </div>
                    <div className="custom-w-43 custom-w-25 contact-details-col1">
                      <label
                        className=" custom-label-state label"
                        htmlFor="phone-label"
                      >
                        Label
                      </label>
                      <div className="record-select-input mob-res-mar-0">
                        <Select
                          options={PhoneLabels}
                          initialValue={values.phones.phoneLabel}
                          onChange={(value) =>
                            setFieldValue("phones.phoneLabel", value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contact-details-row mob-res-row1">
                  <div className="contact-details-col1 mob-res-w-100">
                    <Textfield
                      id="contact-address"
                      className={`${styles["contact-address"]} hide-field-error`}
                      label="Address"
                      placeholder={"Enter address"}
                      name="address.address1"
                      value={values.address.address1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.address?.address1 ? true : false}
                    />
                    {touched.address?.address1 && errors.address?.address1 && (
                      <ul className="details-edit-custom-error-msg">
                        <li className="error-msg-red">
                          {errors.address?.address1}
                        </li>
                      </ul>
                    )}
                  </div>
                  <div className="res-add-2 responsive-w-50 custom-w-25 contact-details-col1 mob-res-margin">
                    <Textfield
                      id="contact-address2"
                      className={`${styles["contact-address"]} hide-field-error`}
                      label="Address 2"
                      placeholder={"Enter Apt, Suite, Unit"}
                      name="address.address2"
                      value={values.address.address2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.address?.address2 ? true : false}
                    />
                    {touched.address?.address2 && errors.address?.address2 && (
                      <ul className="details-edit-custom-error-msg">
                        <li className="error-msg-red">
                          {errors.address?.address2}
                        </li>
                      </ul>
                    )}
                  </div>
                  <div className="custom-w-25 contact-details-col1 visibility-hidden"></div>
                </div>
                <div className="contact-details-row mobile-responsive-row">
                  <div className="mr-1 custom-w-186 contact-details-col1">
                    <Textfield
                      id="contact-address__city"
                      className={`${styles["contact-address--city"]}  hide-field-error`}
                      label="City"
                      name="address.city"
                      value={values.address.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.address?.city ? true : false}
                    />
                    {touched.address?.city && errors.address?.city && (
                      <ul className="details-edit-custom-error-msg">
                        <li className="error-msg-red">
                          {errors.address?.city}
                        </li>
                      </ul>
                    )}
                  </div>
                  <div className="ml-65 custom-w-12 state--label--space custom-w-25 contact-details-col1">
                    <label
                      className="custom-label-state label"
                      htmlFor="phone-label"
                    >
                      State
                    </label>
                    <div className="state-select-input mob-res-mar-0">
                      <Select
                        placeholder="select"
                        showValueAsLabel={true}
                        className={`${styles["contact-address--statecode"]} `}
                        options={STATES}
                        initialValue={values.address.stateCode}
                        onChange={(value) => {
                          setFieldValue("address.stateCode", value);
                        }}
                      />
                    </div>
                  </div>
                  <div className=" custom-w-10 custom-w-25 contact-details-col1 mob-res-margin">
                    <Textfield
                      id="contact-address__zip"
                      className={`${styles["contact-address--zip"]} custom-address-zip hide-field-error`}
                      label="ZIP Code"
                      name="address.postalCode"
                      value={values.address.postalCode}
                      onChange={(e) => {
                        setFieldValue("address.postalCode", e.target.value);
                        setFieldValue("address.county", "");
                        doFetch(e.target.value);
                      }}
                      onBlur={handleBlur}
                      error={errors.address?.postalCode ? true : false}
                    />
                    {errors.address?.postalCode && (
                      <ul className="details-edit-custom-error-msg">
                        <li className="error-msg-red zip-code-error-msg">
                          {errors.address?.postalCode}
                        </li>
                      </ul>
                    )}
                  </div>
                  <div className="mob-res-mt-29 custom-w-25 contact-details-col1">
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
                      />
                    </div>
                  </div>
                </div>
                {duplicateLeadIds?.length > 0 && (
                  <div className="duplicate-lead mt-5 mb-4">
                    <div>
                      <Warning />
                    </div>
                    <div className="duplicate-lead--text pl-1">
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
                <div
                  className="btn-responsive-display mt-3"
                  style={{ display: "flex" }}
                >
                  <Button
                    className="edit-contact-details-cancel-btn contact-details-cancel cancel-btn btn mr-2 ml-10"
                    data-gtm="new-contact-cancel-button"
                    label="Cancel"
                    onClick={() => props.setEdit(false)}
                  />
                  <Button
                    className={`contact-details-submit submit-btn btn ${
                      !dirty || !isValid ? "btn-disabled" : ""
                    }`}
                    data-gtm="new-contact-create-button"
                    label="Save Changes"
                    disabled={!dirty || !isValid}
                    onClick={handleSubmit}
                  />
                </div>
              </Form>
            </div>
          </>
        );
      }}
    </Formik>
  );
};
