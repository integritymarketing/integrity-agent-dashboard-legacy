import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Button } from "components/ui/Button";
import Container from "components/ui/container";
import Textfield from "components/ui/textfield";
import Warning from "components/icons/warning";
import { Select } from "components/ui/Select";
import validationService from "services/validationService";
import styles from "../ContactsPage.module.scss";
import clientService from "../../../services/clientsService";
import useToast from "../../../hooks/useToast";
import { formatPhoneNumber } from "utils/phones";
import { STATES } from "utils/address";
import analyticsService from "services/analyticsService";

const CONTACT_RECORD_TYPE = [
  { value: "prospect", label: "Prospect" },
  { value: "client", label: "Client" },
];

const PHONE_LABELS = [
  { value: "mobile", label: "Mobile" },
  { value: "home", label: "Home" },
];

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

const EditContactForm = (props) => {
  let {
    firstName = "",
    lastName = "",
    emails = [],
    phones = [],
    addresses = [],
    contactPreferences,
    contactRecordType = "prospect",
    leadsId,
    leadStatusId,
    notes,
  } = props.personalInfo;

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
  const postalCode =
    addressData && addressData.postalCode ? addressData.postalCode : "";
  const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";
  const phoneLabel =
    phoneData && phoneData.phoneLabel ? phoneData.phoneLabel : "mobile";

  const isPrimary = contactPreferences.primary
    ? contactPreferences.primary
    : "phone";

  const [showAddress2, setShowAddress2] = useState(
    address2 !== "" ? true : false
  );
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
  return (
    <Formik
      initialValues={{
        firstName: firstName,
        lastName: lastName,
        email: email,
        phones: {
          leadPhone: phone,
          phoneLabel: phoneLabel.toLowerCase(),
        },
        address: {
          address1: address1,
          address2: address2,
          city: city,
          stateCode: stateCode,
          postalCode: postalCode,
        },
        primaryCommunication: isPrimary,
        contactRecordType: contactRecordType.toLowerCase(),
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
              name: "address.city",
              validator: validationService.composeValidator([
                validationService.validateCity,
              ]),
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
        setSubmitting(true);
        let response = await clientService.updateLead(values);
        if (response.ok) {
          setTimeout(() => {
            props.getContactRecordInfo();
            goToContactDetailPage(leadsId);
            props.setDisplay("Details");
            setSubmitting(false);
            addToast({
              message: "Contact updated successfully",
            });
          }, 2000);
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
      }) => (
        <Form className="form mt-3">
          <fieldset className="form__fields form__fields--constrained">
            <Textfield
              id="contact-fname"
              label="First Name"
              placeholder={"Enter first name"}
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.firstName && errors.firstName}
            />
            <Textfield
              id="contact-lname"
              label="Last Name"
              placeholder="Enter last name"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.lastName && errors.lastName}
            />
          </fieldset>
          <div className="mt-3 mb-3 border-bottom border-bottom--light" />
          <fieldset className="form__fields form__fields--constrained">
            <Textfield
              id="contact-address"
              className={`${styles["contact-address"]}`}
              label="Address"
              placeholder={"Enter address"}
              name="address.address1"
              value={values.address.address1}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.address?.address1 && errors.address?.address1}
            />
            {!showAddress2 && (
              <h4 className="address--2" onClick={() => setShowAddress2(true)}>
                + Add Apt, Suite, Unit etc.
              </h4>
            )}
            {showAddress2 && (
              <Textfield
                id="contact-address2"
                className={`${styles["contact-address"]}`}
                label="Apt, Suite, Unit"
                placeholder={"Enter Apt, Suite, Unit"}
                name="address.address2"
                value={values.address.address2}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            )}
            <div
              className="address__city__state__zip"
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
                error={errors.address?.city ? true : false}
              />
              <div>
                <label className="label" htmlFor="phone-label">
                  State
                </label>
                <div className="state-select-input">
                  <Select
                    showValueAsLabel={true}
                    className={`${styles["contact-address--statecode"]}`}
                    options={STATES}
                    initialValue={values.address.stateCode}
                    onChange={(value) => {
                      setFieldValue("address.stateCode", value);
                    }}
                  />
                </div>
              </div>
              <Textfield
                id="contact-address__zip"
                className={`${styles["contact-address--zip"]}`}
                label="ZIP Code"
                name="address.postalCode"
                value={values.address.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.address?.postalCode ? true : false}
              />
            </div>
            {(errors.address?.city || errors.address?.postalCode) && (
              <div className="errors-block">
                {errors.address?.city && (
                  <p className="error-msg">{errors.address?.city}</p>
                )}
                {errors.address?.postalCode && (
                  <p className="error-msg">{errors.address?.postalCode}</p>
                )}
              </div>
            )}
          </fieldset>
          <div className="mt-3 mb-3 border-bottom border-bottom--light" />
          <fieldset className="form__fields form__fields--constrained">
            <Textfield
              id="contact-email"
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
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
                value={formatPhoneNumber(values.phones.leadPhone)}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phones?.leadPhone && errors.phones?.leadPhone}
              />
              <div>
                <label className="label" htmlFor="phone-label">
                  Label
                </label>
                <Select
                  options={PHONE_LABELS}
                  style={{ width: "140px" }}
                  initialValue={values.phones.phoneLabel}
                  onChange={(value) =>
                    setFieldValue("phones.phoneLabel", value)
                  }
                />
              </div>
            </div>
            <div>
              <Field
                type="radio"
                className="mr-1"
                id="primary--phone"
                name="primaryCommunication"
                value="phone"
              />
              <label htmlFor="primary--phone">Primary Communication</label>
            </div>
          </fieldset>
          <div className="mt-3 mb-3 border-bottom border-bottom--light" />
          <div>
            <label className="label" htmlFor="contact--record--type">
              Contact Record Type
            </label>
            <Select
              style={{ width: 146 }}
              options={CONTACT_RECORD_TYPE}
              initialValue={values.contactRecordType}
              onChange={(value) => setFieldValue("contactRecordType", value)}
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
                className="contact-details-cancel cancel-btn btn mr-2"
                data-gtm="new-contact-cancel-button"
                label="Cancel"
                onClick={() => props.setDisplay("Details")}
              />
              <Button
                className={`contact-details-submit submit-btn btn ${
                  !dirty || !isValid ? "btn-disabled" : ""
                }`}
                data-gtm="new-contact-create-button"
                label="Save"
                disabled={!dirty || !isValid}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default function EditContactPage(props) {
  return (
    <>
      <div className="v2">
        <Container
          id="main-content"
          className={`br-8 add--new-contact ${styles["add--new-contact"]}`}
        >
          <h3 className="hdg hdg--3 pt-3 pb-2 contact-details-heading">
            Contact Details
          </h3>
          <div className="border-bottom border-bottom--light"></div>
          <EditContactForm {...props} />
        </Container>
      </div>
    </>
  );
}
