import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import Container from "components/ui/container";
import ResourceSection from "components/ui/resourcesCard";
import Heading2 from "packages/Heading2";
import * as Sentry from "@sentry/react";
import { Formik } from "formik";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import useUserProfile from "hooks/useUserProfile";
import Textfield from "components/ui/textfield";
import CopyPersonalURL from "components/ui/CopyPersonalURL";
import validationService from "services/validationService";
import useFlashMessage from "hooks/useFlashMessage";
import useLoading from "hooks/useLoading";
import authService from "services/authService";
import analyticsService from "services/analyticsService";
import ActiveSellingPermissionTable from "./ActiveSellingPermissionTable";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import { formatTwiloNumber } from "utils/formatTwiloNumber";
import MyModal from "../partials/global-nav-v2/MyModal";
import AuthContext from "contexts/auth";
import useToast from "hooks/useToast";
import clientService from "services/clientsService";
import { welcomeModalOpenAtom } from "recoil/agent/atoms";
import { useSetRecoilState } from "recoil";
import styles from "./AccountPage.module.scss";

function CheckinPreferences() {
  const auth = useContext(AuthContext);
  const addToast = useToast();
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [phone, setPhone] = useState("");
  const [virtualNumber, setVirtualNumber] = useState("");
  const [callForwardNumber, setCallForwardNumber] = useState("");
  const [leadPreference, setLeadPreference] = useState({});
  const [loading, setLoading] = useState(true);
  const setWelcomeModalOpen = useSetRecoilState(welcomeModalOpenAtom);

  useEffect(() => {
    const loadAsyncData = async () => {
      const user = await auth.getUser();
      const { agentid } = user.profile;
      getAgentAvailability(agentid);
      setUser(user.profile);
    };
    if (auth.isAuthenticated()) {
      loadAsyncData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getAgentAvailability = async (agentid) => {
    if (!agentid) {
      return;
    }
    try {
      setLoading(true);
      const response = await clientService.getAgentAvailability(agentid);
      const {
        isAvailable,
        phone,
        agentVirtualPhoneNumber,
        callForwardNumber,
        leadPreference,
      } = response || {};
      if (!agentVirtualPhoneNumber) {
        await clientService.genarateAgentTwiloNumber(agentid);
      }
      if (!leadPreference?.isAgentMobilePopUpDismissed) {
        setWelcomeModalOpen(true);
      }
      setIsAvailable(isAvailable);
      setPhone(formatPhoneNumber(phone, true));
      setLeadPreference(leadPreference);
      if (agentVirtualPhoneNumber) {
        setVirtualNumber(formatPhoneNumber(agentVirtualPhoneNumber, true));
      }
      if (callForwardNumber) {
        setCallForwardNumber(callForwardNumber);
      }
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  const updateAgentAvailability = async (data) => {
    try {
      let response = await clientService.updateAgentAvailability(data);
      if (response.ok) {
        getAgentAvailability(data.agentID);
      }
    } catch (error) {
      addToast({
        type: "error",
        message: "Failed to Save the Availability.",
        time: 10000,
      });
      Sentry.captureException(error);
    }
  };

  const updateAgentPreferences = async (data) => {
    try {
      await clientService.updateAgentPreferences(data);
    } catch (error) {
      addToast({
        type: "error",
        message: "Failed to Save the Preferences.",
        time: 10000,
      });
      Sentry.captureException(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MyModal
      phone={phone}
      virtualNumber={virtualNumber}
      user={user}
      handleOpen={handleOpen}
      handleClose={handleClose}
      open={open}
      checkInPreference
      isAvailable={isAvailable}
      updateAgentAvailability={updateAgentAvailability}
      updateAgentPreferences={updateAgentPreferences}
      callForwardNumber={callForwardNumber}
      leadPreference={leadPreference}
      getAgentAvailability={getAgentAvailability}
    />
  );
}

const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
};

export default () => {
  const { show: showMessage } = useFlashMessage();
  const loading = useLoading();
  const userProfile = useUserProfile();
  const { firstName, lastName, npn, email, phone } = userProfile;
  const {
    agentInfomration: { agentVirtualPhoneNumber },
  } = useAgentInformationByID();

  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/update-account/",
    });
  }, []);

  let mainContentClassName = "container " + styles.headerLayout;
  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Edit Account</title>
      </Helmet>
      <GlobalNav />
      <div className="v2" data-gtm="account-update-form">
        <div className={styles.headerLayoutContainer}>
          <div id="main-content" className={mainContentClassName}>
            <div>
              <Heading2 className={styles.headerLayoutText} text="Account" />
            </div>
          </div>
        </div>
        {userProfile.id && (
          <Container className="mt-scale-2">
            <div className={styles.accountPageContainer}>
              <div>
                {" "}
                <section>
                  <Heading2
                    className={styles.headingText}
                    text="Personal Information"
                  />
                  <Formik
                    initialValues={{
                      firstName,
                      lastName,
                      phone: phone ? formatPhoneNumber(phone) : "",
                      npn,
                      email,
                    }}
                    validate={(values) => {
                      return validationService.validateMultiple(
                        [
                          {
                            name: "firstName",
                            validator: validationService.validateRequired,
                            args: ["First Name"],
                          },
                          {
                            name: "lastName",
                            validator: validationService.validateRequired,
                            args: ["Last Name"],
                          },
                          {
                            name: "phone",
                            validator: validationService.composeValidator([
                              validationService.validateRequired,
                              validationService.validatePhone,
                            ]),
                          },
                          {
                            name: "email",
                            validator: validationService.composeValidator([
                              validationService.validateRequired,
                              validationService.validateEmail,
                            ]),
                          },
                        ],
                        values
                      );
                    }}
                    onSubmit={async (values, { setErrors, setSubmitting }) => {
                      setSubmitting(true);
                      loading.begin(0);

                      const formattedValues = Object.assign({}, values, {
                        phone: values.phone
                          ? `${values.phone}`.replace(/\D/g, "")
                          : "",
                      });

                      let response = await authService.updateAccountMetadata(
                        formattedValues
                      );
                      if (response.status >= 200 && response.status < 300) {
                        analyticsService.fireEvent("event-form-submit", {
                          formName: "update-account",
                        });
                        await authService.signinSilent();

                        setSubmitting(false);
                        loading.end();

                        showMessage("Your account info has been updated.", {
                          type: "success",
                        });
                      } else {
                        loading.end();
                        if (response.status === 401) {
                          authService.handleExpiredToken();
                        } else {
                          const errorsArr = await response.json();
                          analyticsService.fireEvent(
                            "event-form-submit-invalid",
                            {
                              formName: "update-account",
                            }
                          );
                          setErrors(
                            validationService.formikErrorsFor(
                              validationService.standardizeValidationKeys(
                                errorsArr
                              )
                            )
                          );
                        }
                      }
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      isValid,
                      dirty,
                      handleSubmit,
                      handleChange,
                      handleBlur,
                    }) => (
                      <form
                        action=""
                        className="form mt-3"
                        onSubmit={handleSubmit}
                      >
                        <fieldset className="form__fields form__fields--constrained">
                          <Textfield
                            id="account-fname"
                            label="First Name"
                            placeholder={"Enter your first name"}
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.firstName && errors.firstName}
                          />
                          <Textfield
                            id="account-lname"
                            label="Last Name"
                            placeholder="Enter your last name"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lastName && errors.lastName}
                          />
                          <Textfield
                            id="account-npn"
                            label=" National Producer Number (NPN)"
                            placeholder="Enter your NPN"
                            name="npn"
                            value={values.npn}
                            readOnly
                          />
                          {/* <NPNLink>Need to request an NPN?</NPNLink> */}
                          <Textfield
                            id="account-email"
                            type="email"
                            label="Email Address"
                            placeholder="Enter your email address"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && errors.email}
                          />
                          <Textfield
                            id="account-phone"
                            label="Phone Number"
                            type="tel"
                            placeholder="XXX-XXX-XXXX"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              (touched.phone && errors.phone) || errors.Global
                            }
                          />
                          <div className="form__submit">
                            <button
                              className="btn-v2"
                              data-gtm="account-update-save-button"
                              type="submit"
                              disabled={!dirty || !isValid}
                            >
                              Save
                            </button>
                          </div>
                        </fieldset>
                      </form>
                    )}
                  </Formik>
                </section>
                <section className="mt-3">
                  <Heading2
                    className={styles.headingText}
                    text="Change your password"
                  />
                  <Formik
                    initialValues={{
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    }}
                    validate={(values) => {
                      return validationService.validateMultiple(
                        [
                          {
                            name: "currentPassword",
                            validator: validationService.validateRequired,
                            args: ["Current Password"],
                          },
                          {
                            name: "newPassword",
                            validator:
                              validationService.validatePasswordCreation,
                            args: ["New Password"],
                          },
                          {
                            name: "confirmPassword",
                            validator: validationService.validateFieldMatch(
                              values.newPassword
                            ),
                          },
                        ],
                        values
                      );
                    }}
                    onSubmit={async (values, { setErrors, setSubmitting }) => {
                      setSubmitting(true);
                      loading.begin(0);

                      let response = await authService.updateAccountPassword(
                        values
                      );
                      if (response.status >= 200 && response.status < 300) {
                        setSubmitting(false);
                        loading.end();

                        showMessage(
                          "Your password has been successfully updated.",
                          {
                            type: "success",
                          }
                        );
                      } else {
                        loading.end();
                        if (response.status === 401) {
                          authService.handleExpiredToken();
                        } else {
                          const errorsArr = await response.json();
                          setErrors(
                            validationService.formikErrorsFor(
                              validationService.standardizeValidationKeys(
                                errorsArr
                              )
                            )
                          );
                        }
                      }
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      isValid,
                      dirty,
                      handleSubmit,
                      handleChange,
                      handleBlur,
                    }) => (
                      <form
                        action=""
                        className="form mt-3"
                        onSubmit={handleSubmit}
                      >
                        <fieldset className="form__fields form__fields--constrained">
                          <Textfield
                            id="account-password-current"
                            type="password"
                            label="Current Password"
                            placeholder="Enter your current password"
                            name="currentPassword"
                            value={values.currentPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.currentPassword && errors.currentPassword
                            }
                            success={
                              touched.currentPassword && !errors.currentPassword
                            }
                          />
                          <Textfield
                            id="account-password"
                            type="password"
                            label="Create New Password"
                            placeholder="Create a new password"
                            name="newPassword"
                            value={values.newPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.newPassword && errors.newPassword}
                            success={touched.newPassword && !errors.newPassword}
                            focusBanner={
                              <div className="form-tip">
                                <p>Your password must: </p>
                                <ul className="list-basic">
                                  <li>Be at least 8 characters long</li>
                                  <li>
                                    Include at least one uppercase and lowercase
                                    letter
                                  </li>
                                  <li>Include at least one number</li>
                                  <li>
                                    Include at least one non-alphanumeric
                                    character
                                  </li>
                                </ul>
                              </div>
                            }
                            focusBannerVisible={!!errors.newPassword}
                          />
                          <Textfield
                            id="account-password-verify"
                            type="password"
                            label="Re-enter New Password"
                            placeholder="Re-enter your new password"
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.confirmPassword && errors.confirmPassword
                            }
                            success={
                              touched.confirmPassword &&
                              !errors.confirmPassword &&
                              !errors.newPassword
                            }
                          />
                          <div className="form__submit">
                            <button
                              className="btn-v2"
                              type="submit"
                              disabled={!dirty || !isValid}
                            >
                              Save
                            </button>
                          </div>
                        </fieldset>
                      </form>
                    )}
                  </Formik>
                </section>
              </div>
              <div className={styles.medicareCenterContainer}>
                {" "}
                <section>
                  <Heading2
                    className={styles.headingText}
                    text="MedicareCENTER Agent Phone Number"
                  />
                  <div className={styles.accontCard}>
                    <Heading2
                      className={styles.agentPhone}
                      id="transition-modal-description"
                      text={formatTwiloNumber(agentVirtualPhoneNumber)}
                    />
                  </div>
                </section>
                <section className="pt-1">
                  <Heading2
                    className={styles.headingText}
                    text="Personal Agent Website"
                  />
                  <div className={styles.accontCard}>
                    <CopyPersonalURL agentnpn={npn} />
                  </div>
                </section>
                <section className="pt-1">
                  <CheckinPreferences />
                </section>
              </div>
            </div>
          </Container>
        )}
        <div className={styles.rtsTableContainer}>
          <ActiveSellingPermissionTable npn={npn} />
          <div>
            <ResourceSection />
          </div>
        </div>
      </div>
      <GlobalFooter />
    </React.Fragment>
  );
};
