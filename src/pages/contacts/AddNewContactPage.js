import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
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
import { STATES } from "utils/address";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import { formatPhoneNumber } from "utils/phones";
import analyticsService from "services/analyticsService";

const CONTACT_RECORD_TYPE = [
  { value: "prospect", label: "Prospect" },
  { value: "client", label: "Client" },
];

const PHONE_LABELS = [
  { value: "mobile", label: "Mobile" },
  { value: "home", label: "Home" },
];

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

const NewContactForm = () => {
  const [showAddress2, setShowAddress2] = useState(false);
  const [duplicateLeadIds, setDuplicateLeadIds] = useState([]);
  const history = useHistory();
  const addToast = useToast();

  const getContactLink = (id) => `/contact/${id}`;
  const goToContactDetailPage = (id) => {
    if (duplicateLeadIds.length) {
      return history.push(
        getContactLink(id).concat(`/duplicate/${duplicateLeadIds[0]}`)
      );
    }
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

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        phones: {
          leadPhone: "",
          phoneLabel: "mobile",
        },
        address: {
          address1: "",
          address2: "",
          city: "",
          stateCode: "",
          postalCode: "",
        },
        primaryCommunication: "phone",
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
          addToast({
            message: "Contact added successfully",
          });
          setTimeout(() => {
            goToContactDetailPage(leadId);
            setSubmitting(false);
          }, 3000);
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
              onChange={(value) => {
                analyticsService.fireEvent("event-content-load", {
                  selection: `record type ${value}`,
                });
                setFieldValue("contactRecordType", value);
              }}
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

export default function AddNewContactPage() {
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
          className={`mt-4 add--new-contact ${styles["add--new-contact"]}`}
        >
          <ToastContextProvider>
            <h3 className="hdg hdg--3 pt-3 pl-3 pb-2">Contact Details</h3>
            <div className="border-bottom border-bottom--light"></div>
            <NewContactForm />
          </ToastContextProvider>
        </Container>
      </div>
      <GlobalFooter />
    </>
  );
}
