import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button } from "components/ui/Button";
import Container from "components/ui/container";
import Textfield from "components/ui/textfield";
import { Select } from "components/ui/Select";
import validationService from "services/validationService";
import styles from "../ContactsPage.module.scss";
import clientService from "../../../services/clientsService";
import useToast from "../../../hooks/useToast";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import { formatPhoneNumber } from "utils/phones";

const CONTACT_RECORD_TYPE = [
  { value: "prospect", label: "Prospect" },
  { value: "client", label: "Client" },
];

const PHONE_LABELS = [
  { value: "mobile", label: "Mobile" },
  { value: "home", label: "Home" },
];

const EditContactForm = (props) => {
  let {
    firstName = "",
    lastName = "",
    emails = [],
    phones = [],
    addresses = [],
    contactPreferences = [],
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
    phoneData && phoneData.phoneLabel ? phoneData.phoneLabel : "";

  const isPrimary = contactPreferences.primary
    ? contactPreferences.primary
    : "phone";

  const [showAddress2, setShowAddress2] = useState(
    address2 !== "" ? true : false
  );

  const addToast = useToast();
  return (
    <Formik
      initialValues={{
        firstName: firstName,
        lastName: lastName,
        email: email,
        phones: {
          leadPhone: phone,
          phoneLabel: phoneLabel,
        },
        address: {
          address1: address1,
          address2: address2,
          city: city,
          stateCode: stateCode,
          postalCode: postalCode,
        },
        primaryCommunication: isPrimary,
        contactRecordType: contactRecordType,
        emailID,
        leadAddressId,
        phoneId,
        leadStatusId,
        leadsId,
        notes,
      }}
      validate={(values) => {
        return validationService.validateMultiple(
          [
            {
              name: "firstName",
              validator: validationService.validateUsername,
              args: ["First Name"],
            },
            {
              name: "lastName",
              validator: validationService.validateUsername,
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
              name: "address.stateCode",
              validator: validationService.composeValidator([
                validationService.validateState,
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
      }}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        setSubmitting(true);
        let response = await clientService.updateLead(values);
        if (response.ok) {
          addToast({
            message: "Contact updated successfully",
          });
          setTimeout(() => {
            props.getContactRecordInfo();
            props.setDisplay("Details");
            setSubmitting(false);
          }, 2000);
        } else if (response.status === 400) {
          addToast({
            type: "error",
            message: "Error while updating contact",
          });
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
              placeholder={"Enter your first name"}
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.firstName && errors.firstName}
            />
            <Textfield
              id="contact-lname"
              label="Last Name"
              placeholder="Enter your last name"
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
              placeholder={"Enter your address"}
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
                error={touched.address?.city && errors.address?.city}
              />
              <Textfield
                id="contact-address__statecode"
                className={`${styles["contact-address--statecode"]} mr-1`}
                label="State"
                name="address.stateCode"
                value={values.address.stateCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address?.stateCode && errors.address?.stateCode}
              />
              <Textfield
                id="contact-address__zip"
                className={`${styles["contact-address--zip"]}`}
                label="ZIP Code"
                name="address.postalCode"
                value={values.address.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.address?.postalCode && errors.address?.postalCode
                }
              />
            </div>
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
                  initialValue="mobile"
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
              initialValue="prospect"
              onChange={(value) => setFieldValue("contactRecordType", value)}
            />

            <div className="mt-5 pb-5" style={{ display: "flex" }}>
              <Button
                className="mr-2"
                data-gtm="new-contact-cancel-button"
                label="Cancel"
                type="secondary"
                onClick={() => props.setDisplay("Details")}
              />
              <Button
                data-gtm="new-contact-create-button"
                label="Save"
                type="primary"
                disabled={!dirty}
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
          <ToastContextProvider>
            <h3 className="hdg hdg--3 pt-3 pb-2">Contact Details</h3>
            <div className="border-bottom border-bottom--light"></div>
            <EditContactForm {...props} />
          </ToastContextProvider>
        </Container>
      </div>
    </>
  );
}
