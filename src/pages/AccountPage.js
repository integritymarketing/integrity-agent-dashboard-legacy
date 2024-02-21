/* eslint-disable max-lines-per-function */
import * as Sentry from "@sentry/react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Media from "react-media";

import { Form, Formik } from "formik";
import AccountMobile from "mobile/AcoountPage";
import SectionContainer from "mobile/Components/SectionContainer";
import SubHeaderMobile from "mobile/Components/subHeader";
import { useRecoilState, useSetRecoilState } from "recoil";
import { agentPhoneAtom, welcomeModalOpenAtom } from "recoil/agent/atoms";

import { isEmptyObj } from "utils/shared-utils/sharedUtility";

import useAgentInformationByID from "hooks/useAgentInformationByID";
import useFetch from "hooks/useFetch";
import useLoading from "hooks/useLoading";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

import Heading2 from "packages/Heading2";

import EditIcon from "components/icons/icon-edit";
import Container from "components/ui/container";
import ResourceSection from "components/ui/resourcesCard";
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
import { LeadSource } from "./Account/AvailabilityPreferences/LeadSource";
import styles from "./AccountPage.module.scss";
import { useParams } from "react-router-dom";
import { LIFE, useAccountProductsContext } from "./Account/providers/AccountProductsProvider";

function CheckinPreferences() {
    const { agentId } = useUserProfile();
    const [phone, setPhone] = useState("");
    const [callForwardNumber, setCallForwardNumber] = useState("");
    const [loading, setLoading] = useState(true);
    const setWelcomeModalOpen = useSetRecoilState(welcomeModalOpenAtom);
    const [phoneAtom] = useRecoilState(agentPhoneAtom);

    useEffect(() => {
        const loadAsyncData = () => {
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
            const { phone, agentVirtualPhoneNumber, callForwardNumber, leadPreference } = response || {};
            if (!agentVirtualPhoneNumber) {
                await clientsService.genarateAgentTwiloNumber(agentId);
            }
            if (!leadPreference?.isAgentMobilePopUpDismissed) {
                setWelcomeModalOpen(true);
            }
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
            <LeadSource />
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
    const { section } = useParams();
    const sellingPermissionsRef = useRef(null);
    const selfAttestedPermissionsRef = useRef(null);
    const { setLayout } = useAccountProductsContext();

    useEffect(() => {
        analyticsService.fireEvent("event-content-load", {
            pagePath: "/update-account/",
        });
    }, []);

    useEffect(() => {
        if (section === "sellingPermissions" && sellingPermissionsRef.current) {
            setLayout(LIFE);
            sellingPermissionsRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (section === "selfAttestedPermissions" && selfAttestedPermissionsRef.current) {
            setLayout(LIFE);
            selfAttestedPermissionsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    });

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
                <title>Integrity - Edit Account</title>
            </Helmet>
            <GlobalNav />
            <div className={`v2 ${styles.accountPageBodySection}`} data-gtm="account-update-form">
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
                    <div ref={sellingPermissionsRef}>
                        <ActivePermissions />
                    </div>
                    <div ref={selfAttestedPermissionsRef}>
                        <SelfAttestedPermissions />{" "}
                    </div>
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
