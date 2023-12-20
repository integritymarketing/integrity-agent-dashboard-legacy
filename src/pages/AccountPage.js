import * as Sentry from "@sentry/react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Media from "react-media";

import { Form, Formik } from "formik";
import AccountMobile from "mobile/AcoountPage";
import SectionContainer from "mobile/Components/SectionContainer";
import SubHeaderMobile from "mobile/Components/subHeader";
import { useRecoilState, useSetRecoilState } from "recoil";
import { agentPhoneAtom, welcomeModalOpenAtom } from "recoil/agent/atoms";

import { isEmptyObj } from "utils/shared-utils/sharedUtility";

import { useAgentAvailability } from "hooks/useAgentAvailability";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import useFetch from "hooks/useFetch";
import useLoading from "hooks/useLoading";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

import Dialog from "packages/Dialog";
import Heading2 from "packages/Heading2";

import HealthIcon from "components/icons/health";
import EditIcon from "components/icons/icon-edit";
import LifeIcon from "components/icons/life";
import Container from "components/ui/container";
import ResourceSection from "components/ui/resourcesCard";
import Switch from "components/ui/switch";
import Textfield from "components/ui/textfield";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import Mobile from "partials/global-nav-v2/Mobile.svg";

import analyticsService from "services/analyticsService";
import authService from "services/authService";
import clientsService from "services/clientsService";
import validationService from "services/validationService";

import { ActivePermissions } from "./Account/ActivePermissions";
import AgentPhone from "./Account/AgentPhone";
import AgentWebsite from "./Account/AgentWebsite";
import { SelfAttestedPermissions } from "./Account/SelfAttestedPermissions";
import { SellingPreferences } from "./Account/SellingPreferences";
import styles from "./AccountPage.module.scss";

function CheckinPreferences({ npn }) {
    const { agentId } = useUserProfile();
    const showToast = useToast();
    const [phone, setPhone] = useState("");
    const [callForwardNumber, setCallForwardNumber] = useState("");
    const [leadPreference, setLeadPreference] = useState({});
    const [loading, setLoading] = useState(true);
    const [hasActiveCampaign, setHasActiveCampaign] = useState(false);
    const setWelcomeModalOpen = useSetRecoilState(welcomeModalOpenAtom);
    const [phoneAtom] = useRecoilState(agentPhoneAtom);
    const [showAvilabilityDialog, setShowAvilabilityDialog] = useState(false);
    const [isAvailable, setIsAvailable] = useAgentAvailability();

    useEffect(() => {
        const loadAsyncData = async () => {
            getAgentAvailability(agentId);
        };
        loadAsyncData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phoneAtom, agentId]);

    const getAgentAvailability = async (agentId) => {
        if (!agentId) {
            return;
        }
        try {
            setLoading(true);
            const response = await clientsService.getAgentAvailability(agentId);
            const { phone, agentVirtualPhoneNumber, callForwardNumber, leadPreference, hasActiveCampaign } =
                response || {};
            setHasActiveCampaign(hasActiveCampaign);
            if (!agentVirtualPhoneNumber) {
                await clientsService.genarateAgentTwiloNumber(agentId);
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
            const response = await clientsService.updateAgentPreferences(data);

            if (response?.leadPreference) {
                setLeadPreference({ ...response.leadPreference });
            }
        } catch (error) {
            showToast({
                type: "error",
                message: "Failed to Save the Preferences.",
                time: 10000,
            });
            Sentry.captureException(error);
        }
    };

    const handleLeadCenter = async () => {
        setShowAvilabilityDialog(false);
        const data = {
            agentID: agentId,
            leadPreference: {
                ...leadPreference,
                leadCenter: !leadPreference?.leadCenter,
            },
        };
        await updateAgentPreferences(data);
        if (isAvailable && leadPreference?.leadCenter && !leadPreference?.medicareEnrollPurl) {
            await clientsService.updateAgentAvailability({
                agentID: agentId,
                availability: false,
            });
            setIsAvailable(false);
            setShowAvilabilityDialog(true);
        }
    };

    const handleMedicareEnroll = async () => {
        setShowAvilabilityDialog(false);
        const data = {
            agentID: agentId,
            leadPreference: {
                ...leadPreference,
                medicareEnrollPurl: !leadPreference?.medicareEnrollPurl,
            },
        };
        await updateAgentPreferences(data);
        if (isAvailable && leadPreference?.medicareEnrollPurl && !(leadPreference?.leadCenter && hasActiveCampaign)) {
            await clientsService.updateAgentAvailability({
                agentID: agentId,
                availability: false,
            });
            setIsAvailable(false);
            setShowAvilabilityDialog(true);
        }
    };

    const handleLeadSourceClose = () => {
        setShowAvilabilityDialog(!showAvilabilityDialog);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <SectionContainer title="Availability Preferences">
            <p className={styles.subText}>Calls to your Agent Phone Number will be forwarded to the number below.</p>

            <div>
                <CallCenterContent
                    phone={phone}
                    agentId={agentId}
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
                            action={() => window.open(`/leadcenter-redirect/${npn}`, "_blank")}
                            onChange={handleLeadCenter}
                            disabled={!hasActiveCampaign}
                            checked={hasActiveCampaign ? leadPreference?.leadCenter : false}
                            icon={<HealthIcon />}
                        />
                    </div>

                    <div className={styles.innerSection}>
                        <NotificationSection
                            title="PlanEnroll"
                            onChange={handleMedicareEnroll}
                            checked={leadPreference?.medicareEnrollPurl}
                            icon={<LifeIcon />}
                        />
                    </div>
                </div>
            </div>
            <Dialog
                open={showAvilabilityDialog}
                onClose={handleLeadSourceClose}
                title="Lead Sources Disabled"
                maxWidth="sm"
                titleWithIcon={false}
            >
                You have disabled all lead sources. We have switched off your availability until additional lead sources
                are enabled.
            </Dialog>
        </SectionContainer>
    );
}

const CallCenterContent = ({ agentId, phone, callForwardNumber, getAgentAvailability }) => {
    const showToast = useToast();
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
                    if (!error) {
                        return null;
                    }
                    return {
                        phone: error,
                    };
                }}
                onSubmit={async (values, { setErrors, setSubmitting }) => {
                    const phone = values.phone.replace(/[()\s-]/g, "");
                    setSubmitting(true);
                    try {
                        await clientsService.updateAgentCallForwardingNumber({
                            callForwardNumber: phone,
                            agentID: agentId,
                        });
                        getAgentAvailability(agentId);
                        showToast({
                            message: "Contact number updated succesfully",
                        });
                    } catch (error) {
                        showToast({
                            type: "error",
                            message: "Failed to update the contact",
                        });
                        Sentry.captureException(error);
                    }
                    setIsEditingNumber(false);
                    setSubmitting(false);
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => {
                    return (
                        <Form>
                            <div>
                                <div className={styles.header}>
                                    <p className={styles.subTitle}>Forward calls to:</p>
                                    <div className={styles.editSection}>
                                        {!isEditingNumber && (
                                            <>
                                                <span onClick={() => setIsEditingNumber(true)}>Edit</span>

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
                                                <span className={styles.saveText} onClick={() => handleSubmit()}>
                                                    Save
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {!isEditingNumber ? (
                                    <div className={styles.phoneText}>
                                        <div>
                                            <img src={Mobile} alt="iconmobile" className={styles.imageMobile} />
                                        </div>
                                        <div className={styles.number}>{formatPhoneNumber(values.phone)}</div>
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
                                        {errors.phone && <div className="mb-3" />}
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

const NotificationSection = ({ title, subTitle, actionTitle, action, icon, checked, onChange, disabled }) => {
    return (
        <div className={styles.notificationSection}>
            <div className={styles.iconTitle}>
                {icon}
                <span className={styles.notificationTitle}>
                    {title}
                    {subTitle && <span className={styles.notificationSubTitle}>{subTitle}</span>}
                </span>
            </div>
            {actionTitle && action && (
                <div className={styles.actionTitle} onClick={() => action()}>
                    {actionTitle}
                </div>
            )}
            <Switch className={styles.notificationSwitch} checked={checked} onChange={onChange} disabled={disabled} />
        </div>
    );
};

const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = `${phoneNumberString}`.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return null;
};

const AccountPage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const loading = useLoading();
    const userProfile = useUserProfile();
    const { firstName, lastName, npn, email, phone } = userProfile;
    const {
        agentInformation: { agentVirtualPhoneNumber },
    } = useAgentInformationByID();
    const { Put: updateAccount } = useFetch(`${process.env.REACT_APP_AUTH_AUTHORITY_URL}/api/v2.0/account/update`);
    const { Put: updateAccountPassword } = useFetch(
        `${process.env.REACT_APP_AUTH_AUTHORITY_URL}/api/v2.0/account/updatepassword`
    );

    useEffect(() => {
        analyticsService.fireEvent("event-content-load", {
            pagePath: "/update-account/",
        });
    }, []);

    const buttonTitle = (initialValues, values, errors) => {
        if (initialValues === values) {
            return "No changes have been made";
        }
        if (!isEmptyObj(errors)) {
            return "provide valid data to save";
        }
        return "";
    };

    const showToast = useToast();

    const mainContentClassName = `container ${styles.headerLayout}`;
    return (
        <React.Fragment>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <Helmet>
                <title>Integrity Clients - Edit Account</title>
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

                {userProfile.agentId && (
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
                                                                validator: validationService.validateOnlyAlphabetics,
                                                                args: ["First Name"],
                                                            },
                                                            {
                                                                name: "lastName",
                                                                validator: validationService.validateOnlyAlphabetics,
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
                                                onSubmit={async (values, { setErrors, setSubmitting, resetForm }) => {
                                                    resetForm({ values });
                                                    setSubmitting(true);
                                                    const formattedValues = {
                                                        ...values,
                                                        phone: values.phone ? `${values.phone}`.replace(/\D/g, "") : "",
                                                    };

                                                    const response = await updateAccount(formattedValues, true);
                                                    if (response.status >= 200 && response.status < 300) {
                                                        analyticsService.fireEvent("event-form-submit", {
                                                            formName: "update-account",
                                                        });

                                                        await authService.signinSilent();
                                                        setSubmitting(false);
                                                        showToast({
                                                            message: "Your account info has been updated",
                                                        });
                                                    } else {
                                                        loading.end();
                                                        if (response.status === 401) {
                                                            authService.handleExpiredToken();
                                                        } else {
                                                            const errorsArr = await response.json();
                                                            analyticsService.fireEvent("event-form-submit-invalid", {
                                                                formName: "update-account",
                                                            });
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
                                                    <form action="" className="form mt-3" onSubmit={handleSubmit}>
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
                                                                error={(touched.phone && errors.phone) || errors.Global}
                                                            />
                                                            <div className={styles.submitSection}>
                                                                <button
                                                                    className={styles.submitButton}
                                                                    data-gtm="account-update-save-button"
                                                                    type="submit"
                                                                    title={buttonTitle(initialValues, values, errors)}
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
                                                            validator: validationService.validatePasswordCreation,
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
                                            onSubmit={async (values, { setErrors, setSubmitting, resetForm }) => {
                                                const initialValues = {
                                                    currentPassword: "",
                                                    newPassword: "",
                                                    confirmPassword: "",
                                                };
                                                resetForm({ initialValues });
                                                setSubmitting(true);
                                                const response = await updateAccountPassword(values, true);
                                                if (response.status >= 200 && response.status < 300) {
                                                    setSubmitting(false);
                                                    showToast({
                                                        message: "Your password has been successfully updated.",
                                                    });
                                                } else {
                                                    loading.end();
                                                    const errorsArr = await response.json();
                                                    setErrors(
                                                        validationService.formikErrorsFor(
                                                            validationService.standardizeValidationKeys(errorsArr)
                                                        )
                                                    );
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
                                                <form action="" className="form mt-3" onSubmit={handleSubmit}>
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
                                                            error={touched.currentPassword && errors.currentPassword}
                                                            success={touched.currentPassword && !errors.currentPassword}
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
                                                            focusBannerVisible={Boolean(errors.newPassword)}
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
                                                            error={touched.confirmPassword && errors.confirmPassword}
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
                                    <AgentPhone agentVirtualPhoneNumber={agentVirtualPhoneNumber} />
                                    <AgentWebsite npn={npn} />
                                    <SellingPreferences />
                                </section>
                            </div>
                        </div>
                    </Container>
                )}

                <div className={styles.rtsTableContainer}>
                    <ActivePermissions />
                    <SelfAttestedPermissions />
                    <div>
                        <ResourceSection />
                    </div>
                </div>
            </div>
            <GlobalFooter />
        </React.Fragment>
    );
};

export default AccountPage;
