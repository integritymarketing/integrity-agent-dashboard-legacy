import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import Container from "components/ui/container";
import ResourceSection from "components/ui/resourcesCard";
import Heading2 from "packages/Heading2";
import * as Sentry from "@sentry/react";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import useUserProfile from "hooks/useUserProfile";
import Textfield from "components/ui/textfield";
import validationService from "services/validationService";
import useFlashMessage from "hooks/useFlashMessage";
import useLoading from "hooks/useLoading";
import authService from "services/authService";
import analyticsService from "services/analyticsService";
import ActiveSellingPermissionTable from "./ActiveSellingPermissionTable";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import { isEmptyObj } from "utils/shared-utils/sharedUtility";
import AuthContext from "contexts/auth";
import useToast from "hooks/useToast";
import clientService from "services/clientsService";
import { welcomeModalOpenAtom, agentPhoneAtom } from "recoil/agent/atoms";
import { useSetRecoilState, useRecoilState } from "recoil";
import styles from "./AccountPage.module.scss";
import AccountMobile from "mobile/AcoountPage";
import SubHeaderMobile from "mobile/Components/subHeader";
import Media from "react-media";
import SectionContainer from "mobile/Components/SectionContainer";
import EditIcon from "components/icons/icon-edit";
import AgentPhone from "./Account/AgentPhone";
import AgentWebsite from "./Account/AgentWebsite";
import Switch from "components/ui/switch";
import { Formik, Form } from "formik";
import Mobile from "partials/global-nav-v2/Mobile.svg";
import HealthIcon from "components/icons/health";
import LifeIcon from "components/icons/life";

function CheckinPreferences({ npn }) {
  const auth = useContext(AuthContext);
  const addToast = useToast();
  const [user, setUser] = useState({});
  const [phone, setPhone] = useState("");
  const [callForwardNumber, setCallForwardNumber] = useState("");
  const [leadPreference, setLeadPreference] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasActiveCampaign, setHasActiveCampaign] = useState(false);
  const setWelcomeModalOpen = useSetRecoilState(welcomeModalOpenAtom);
  const [phoneAtom] = useRecoilState(agentPhoneAtom);

  useEffect(() => {
    const loadAsyncData = async () => {
      const user = await auth.getUser();
      const { agentid } = user?.profile;
      getAgentAvailability(agentid);
      setUser(user?.profile);
    };
    if (auth.isAuthenticated()) {
      loadAsyncData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, phoneAtom]);

  const getAgentAvailability = async (agentid) => {
    if (!agentid) {
      return;
    }
    try {
      setLoading(true);
      const response = await clientService.getAgentAvailability(agentid);
      const {
        phone,
        agentVirtualPhoneNumber,
        callForwardNumber,
        leadPreference,
        hasActiveCampaign,
      } = response || {};
      setHasActiveCampaign(hasActiveCampaign);
      if (!agentVirtualPhoneNumber) {
        await clientService.genarateAgentTwiloNumber(agentid);
      }
      if (!leadPreference?.isAgentMobilePopUpDismissed) {
        setWelcomeModalOpen(true);
      }
      setLeadPreference({ ...leadPreference });
      setPhone(formatPhoneNumber(phone, true));
      if (callForwardNumber) {
        setCallForwardNumber(callForwardNumber);
      }
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  const updateAgentPreferences = async (data) => {
    try {
      const response = await clientService.updateAgentPreferences(data);

      if (response?.leadPreference) {
        setLeadPreference({ ...response.leadPreference });
      }
    } catch (error) {
      addToast({
        type: "error",
        message: "Failed to Save the Preferences.",
        time: 10000,
      });
      Sentry.captureException(error);
    }
  };

  const handleLeadCenter = () => {
    let data = {
      agentID: user?.agentid,
      leadPreference: {
        ...leadPreference,
        leadCenter: !leadPreference?.leadCenter,
      },
    };
    updateAgentPreferences(data);
  };
  const handleMedicareEnroll = () => {
    let data = {
      agentID: user?.agentid,
      leadPreference: {
        ...leadPreference,
        medicareEnrollPurl: !leadPreference?.medicareEnrollPurl,
      },
    };
    updateAgentPreferences(data);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SectionContainer title="Availability Preferences">
      <p className={styles.subText}>
        Calls to your Agent Phone Number will be forwarded to the number below.
      </p>

      <div>
        <CallCenterContent
          phone={phone}
          agentId={user?.agentid}
          callForwardNumber={callForwardNumber}
          getAgentAvailability={getAgentAvailability}
        />
      </div>
      <div className={styles.leadCenter}>
        <p className={styles.subTitle}>Lead Source</p>
        <div className={styles.switchWrapper}>
          <div className={styles.health}>
            <NotificationSection
              title="Health"
              actionTitle={!hasActiveCampaign ? "Setup" : "Settings"}
              action={() =>
                window.open(`/leadcenter-redirect/${npn}`, "_blank")
              }
              onChange={() => handleLeadCenter()}
              disabled={!hasActiveCampaign}
              checked={hasActiveCampaign ? leadPreference?.leadCenter : false}
              icon={<HealthIcon />}
            />
          </div>

          <div className={styles.innerSection}>
            <NotificationSection
              title="MedicareEnroll"
              onChange={() => handleMedicareEnroll()}
              checked={leadPreference?.medicareEnrollPurl}
              icon={<LifeIcon />}
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

const CallCenterContent = ({
  agentId,
  phone,
  callForwardNumber,
  getAgentAvailability,
}) => {
  const addToast = useToast();
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const phoneNumber = callForwardNumber || phone;

  return (
    <>
      <Formik
        initialValues={{
          phone: phoneNumber,
        }}
        validate={(values) => {
          const error = validationService.validatePhone(values.phone);
          if (!error) return null;
          return {
            phone: error,
          };
        }}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          const phone = values.phone.replace(/[()\s-]/g, "");
          setSubmitting(true);
          try {
            await clientService.updateAgentCallForwardingNumber({
              callForwardNumber: `${phone}`,
              agentID: agentId,
            });
            getAgentAvailability(agentId);
            addToast({
              message: "Contact number updated succesfully",
            });
          } catch (error) {
            addToast({
              type: "error",
              message: "Failed to update the contact",
            });
            Sentry.captureException(error);
          }
          setIsEditingNumber(false);
          setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => {
          return (
            <Form>
              <div>
                <div className={styles.header}>
                  <p className={styles.subTitle}>Forward calls to:</p>
                  <div className={styles.editSection}>
                    {!isEditingNumber && (
                      <>
                        <span onClick={() => setIsEditingNumber(true)}>
                          Edit
                        </span>

                        <span
                          onClick={() => setIsEditingNumber(true)}
                          className={styles.editIcon}
                        >
                          <EditIcon />
                        </span>
                      </>
                    )}
                    {isEditingNumber && (
                      <>
                        <span
                          className={styles.saveText}
                          onClick={() => {
                            setFieldValue("phone", phoneNumber);
                            setIsEditingNumber(false);
                          }}
                        >
                          Cancel
                        </span>
                        <span
                          className={styles.saveText}
                          onClick={() => handleSubmit()}
                        >
                          Save
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {!isEditingNumber ? (
                  <div className={styles.phoneText}>
                    <div>
                      <img
                        src={Mobile}
                        alt="iconmobile"
                        className={styles.imageMobile}
                      />
                    </div>
                    <div className={styles.number}>
                      {formatPhoneNumber(values.phone)}
                    </div>
                  </div>
                ) : (
                  <div className="editPhoneContainer">
                    <Textfield
                      id="contact-phone"
                      type="tel"
                      placeholder="(XXX) XXX-XXXX"
                      name="phone"
                      value={formatPhoneNumber(values.phone)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && errors.phone}
                    />
                    {errors.phone && <div class="mb-3" />}
                  </div>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

// const NotificationPreferences = () => {
//   return (
//     <SectionContainer
//       fullWidth
//       className={styles.notificationContainer}
//       title="Notification Preferences"
//     >
//       <NotificationSection title="Allow email notifications" />
//       <NotificationSection
//         title="Scope of Appointment"
//         subTitle="Get notified when a contact completes a SOA."
//       />
//       <NotificationSection
//         title="Leads"
//         subTitle="Get notified when a new lead is entered"
//       />
//       <NotificationSection
//         title="Daily Reminders"
//         subTitle="Get updates on your contacts daily."
//       />
//     </SectionContainer>
//   );
// };

const NotificationSection = ({
  title,
  subTitle,
  actionTitle,
  action,
  icon,
  checked,
  onChange,
  disabled,
}) => {
  return (
    <div className={styles.notificationSection}>
      <div className={styles.iconTitle}>
        {icon}
        <span className={styles.notificationTitle}>
          {title}
          {subTitle && (
            <span className={styles.notificationSubTitle}>{subTitle}</span>
          )}
        </span>
      </div>
      {actionTitle && action && (
        <div className={styles.actionTitle} onClick={() => action()}>
          {actionTitle}
        </div>
      )}
      <Switch
        className={styles.notificationSwitch}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
};

export default () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
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

  const buttonTitle = (initialValues, values, errors) => {
    if (initialValues === values) return "No changes have been made";
    if (!isEmptyObj(errors)) return "provide valid data to save";
    return "";
  };

  let mainContentClassName = "container " + styles.headerLayout;
  return (
    <React.Fragment>
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Helmet>
        <title>MedicareCENTER - Edit Account</title>
      </Helmet>
      <GlobalNav />
      <div className="v2" data-gtm="account-update-form">
        {!isMobile ? (
          <div className={styles.headerLayoutContainer}>
            <div id="main-content" className={mainContentClassName}>
              <div>
                <Heading2 className={styles.headerLayoutText} text="Account" />
              </div>
            </div>
          </div>
        ) : (
          <SubHeaderMobile title={"Account"} />
        )}

        {userProfile.id && (
          <Container className="mt-scale-2">
            <div className={styles.accountPageContainer}>
              <div className={styles.sectionOne}>
                <SectionContainer
                  title={"Personal Information"}
                  actionTitle={isEdit ? "Cancel" : "Edit"}
                  callBack={() => {
                    setIsEdit(!isEdit);
                  }}
                  showLeft={isMobile ? true : false}
                  ActionIcon={!isEdit ? <EditIcon /> : null}
                >
                  <section>
                    {isMobile && !isEdit && (
                      <AccountMobile
                        data={{
                          firstName,
                          lastName,
                          phone: phone ? formatPhoneNumber(phone) : "",
                          npn,
                          email,
                        }}
                      />
                    )}

                    {((isMobile && isEdit) || !isMobile) && (
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
                                validator:
                                  validationService.validateOnlyAlphabetics,
                                args: ["First Name"],
                              },
                              {
                                name: "lastName",
                                validator:
                                  validationService.validateOnlyAlphabetics,
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
                        onSubmit={async (
                          values,
                          { setErrors, setSubmitting }
                        ) => {
                          setSubmitting(true);
                          loading.begin(0);

                          const formattedValues = Object.assign({}, values, {
                            phone: values.phone
                              ? `${values.phone}`.replace(/\D/g, "")
                              : "",
                          });

                          let response =
                            await authService.updateAccountMetadata(
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
                          initialValues,
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
                                  (touched.phone && errors.phone) ||
                                  errors.Global
                                }
                              />
                              <div className={styles.submitSection}>
                                <button
                                  className={styles.submitButton}
                                  data-gtm="account-update-save-button"
                                  type="submit"
                                  title={buttonTitle(
                                    initialValues,
                                    values,
                                    errors
                                  )}
                                  disabled={!dirty || !isValid}
                                >
                                  Save
                                </button>
                              </div>
                            </fieldset>
                          </form>
                        )}
                      </Formik>
                    )}
                  </section>
                </SectionContainer>
                <section className="mt-3">
                  <SectionContainer title={"Change Your Password"}>
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
                      onSubmit={async (
                        values,
                        { setErrors, setSubmitting }
                      ) => {
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
                          <fieldset className="form__fields form__fields--constrained ">
                            <Textfield
                              id="account-password-current"
                              type="password"
                              className={styles.customLabel}
                              placeholder="Enter your current password"
                              label="Current Password"
                              name="currentPassword"
                              value={values.currentPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.currentPassword &&
                                errors.currentPassword
                              }
                              success={
                                touched.currentPassword &&
                                !errors.currentPassword
                              }
                            />
                            <Textfield
                              id="account-password"
                              type="password"
                              label="Create New Password"
                              name="newPassword"
                              placeholder="Create a new password"
                              value={values.newPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.newPassword && errors.newPassword}
                              success={
                                touched.newPassword && !errors.newPassword
                              }
                              focusBanner={
                                <div className="form-tip">
                                  <p>Your password must: </p>
                                  <ul className="list-basic">
                                    <li>Be at least 8 characters long</li>
                                    <li>
                                      Include at least one uppercase and
                                      lowercase letter
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
                              name="confirmPassword"
                              placeholder="Re-enter your new password"
                              value={values.confirmPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.confirmPassword &&
                                errors.confirmPassword
                              }
                              success={
                                touched.confirmPassword &&
                                !errors.confirmPassword &&
                                !errors.newPassword
                              }
                            />
                            <div className={styles.submitSection}>
                              <button
                                className={styles.submitButton}
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
                  </SectionContainer>
                </section>
              </div>
              <div className={styles.sectionTwo}>
                <section className={styles.preferences}>
                  <CheckinPreferences npn={npn} />
                  {/* <NotificationPreferences /> */}
                </section>
                <section className={styles.website}>
                  <AgentPhone
                    agentVirtualPhoneNumber={agentVirtualPhoneNumber}
                  />
                  <AgentWebsite npn={npn} />
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
