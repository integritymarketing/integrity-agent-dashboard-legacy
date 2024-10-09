/* eslint-disable max-lines-per-function */
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { Field, Form, Formik } from "formik";

import { formatDate } from "utils/dates";
import PhoneLabels from "utils/phoneLabels";
import { formatPhoneNumber } from "utils/phones";
import { formatMbiNumber, onlyAlphabets, scrollTop } from "utils/shared-utils/sharedUtility";

import useToast from "../../hooks/useToast";
import useQueryParams from "hooks/useQueryParams";
import useAnalytics from "hooks/useAnalytics";

import DatePickerMUI from "components/DatePicker";
import Warning from "components/icons/warning";
import { Button } from "components/ui/Button";
import { Select } from "components/ui/Select";
import Container from "components/ui/container";
import Textfield from "components/ui/textfield";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import CountyContext from "contexts/counties";
import useFilteredLeadIds from "pages/ContactsList/hooks/useFilteredLeadIds";

import analyticsService from "services/analyticsService";
import { useClientServiceContext } from "services/clientServiceProvider";
import validationService from "services/validationService";

import styles from "./ContactsPage.module.scss";
import "./contactRecordInfo/contactRecordInfo.scss";

const NewContactForm = ({
    callLogId,
    firstName,
    lastName,
    state,
    partA = "",
    partB = "",
    medicareBeneficiaryID = "",
    tags = [],
}) => {
    const { get } = useQueryParams();
    const { setFilteredDataHandle } = useFilteredLeadIds();
    const addNewDuplicateErrorRef = useRef();
    const { fireEvent } = useAnalytics();
    const callFrom = get("callFrom");
    const isRelink = get("relink") === "true";
    const [showAddress2, setShowAddress2] = useState(false);
    const [duplicateLeadIds, setDuplicateLeadIds] = useState([]);
    const [zipLengthValid, setZipLengthValid] = useState(false);
    const {
        allCounties = [],
        allStates = [],
        fetchCountyAndState,
        loading: loadingCountyAndState,
    } = useContext(CountyContext);
    const { clientsService, enrollPlansService, callRecordingsService } = useClientServiceContext();
    const navigate = useNavigate();
    const showToast = useToast();

    const isDuplicateContact = useCallback(
        async (values, setDuplicateLeadIds) => {
            // if no phone or email, return false else check for duplicate contact
            const response = await clientsService.getDuplicateContact(values);
            if (response?.ok) {
                const resMessage = await response.json();

                // if duplicate contact, show error and return
                if (resMessage?.isExactDuplicate) {
                    return {
                        firstName: "Duplicate Contact",
                        lastName: "Duplicate Contact",
                        isExactDuplicate: true,
                    };
                } else {
                    // if not duplicate contact, set duplicate lead ids to show in error message because it is potential duplicate contact
                    setDuplicateLeadIds(resMessage?.duplicateLeadIds || []);

                    // return false to indicate not duplicate contact
                    return {
                        isExactDuplicate: false,
                    };
                }
            } else {
                showToast({
                    message: "Issue while checking for duplicate contact",
                    type: "error",
                });

                // if error, return false to indicate not duplicate contact
                return {
                    isExactDuplicate: false,
                };
            }
        },
        [clientsService, showToast]
    );

    const getContactLink = (id) => `/contact/${id}/overview`;
    const goToContactDetailPage = (id) => {
        navigate(getContactLink(id));
    };
    const goToContactPage = () => {
        navigate("/contacts/list");
    };
    const handleMultipleDuplicates = () => {
        if (duplicateLeadIds.length) {
            setFilteredDataHandle("duplicateLeadIds", duplicateLeadIds);
        }
        return true;
    };

    useEffect(() => {
        fetchCountyAndState(""); // eslint-disable-next-line
    }, []);

    const linkContact = async (leadIdParam) => {
        const { policyId, policyNumber, sourceId, agentNpn, policyStatus, firstName, lastName, linkingType } = state;
        const leadIdString = leadIdParam?.toString();

        try {
            const updateBusinessBookPayload = {
                agentNpn: agentNpn,
                leadId: leadIdString,
                policyNumber: policyId || policyNumber,
                consumerFirstName: firstName,
                consumerLastName: lastName,
                leadDate: new Date(),
                leadStatus: policyStatus,
                linkingType: linkingType,
                sourceId,
            };
            const response = await enrollPlansService.updateBookOfBusiness(updateBusinessBookPayload);
            if (response) {
                showToast({
                    message: "Contact linked successfully",
                    time: 4000,
                });
                fireEvent("Call Linked", {
                    leadid: leadIdString,
                });
                setTimeout(() => {
                    goToContactDetailPage(leadIdString);
                    setSubmitting(false);
                }, 4000);
            }
        } catch (error) {
            showToast({
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
                medicareBeneficiaryID: medicareBeneficiaryID ? formatMbiNumber(medicareBeneficiaryID) : "",
                partA: partA ?? "",
                partB: partB ?? "",
                primaryCommunication: "",
            }}
            validate={async (values) => {
                return validationService.validateMultiple(
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
                                validationService.validateRequiredIf("phone" === values.primaryCommunication),
                                validationService.validatePhone,
                            ]),
                        },
                        {
                            name: "email",
                            validator: validationService.composeValidator([
                                validationService.validateRequiredIf("email" === values.primaryCommunication),
                                validationService.validateEmail,
                            ]),
                        },
                        {
                            name: "address.postalCode",
                            validator: validationService.composeValidator([validationService.validatePostalCode]),
                        },
                        {
                            name: "address.address1",
                            validator: validationService.composeValidator([validationService.validateAddress]),
                            args: ["Address"],
                        },
                        {
                            name: "address.address2",
                            validator: validationService.composeValidator([validationService.validateAddress]),
                            args: ["Apt, Suite, Unit"],
                        },
                        {
                            name: "address.city",
                            validator: validationService.composeValidator([validationService.validateAddress]),
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
            }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
                setSubmitting(true);
                const duplicateCheckResult = await isDuplicateContact(values, setDuplicateLeadIds);

                // if duplicate contact, show error and return and don't submit form
                if (duplicateCheckResult?.isExactDuplicate) {
                    analyticsService.fireEvent("event-form-submit-invalid", {
                        formName: "Duplicate Contact Error",
                    });
                    setErrors({
                        firstName: "Duplicate Contact",
                        lastName: "Duplicate Contact",
                    });
                    scrollTop();
                    setSubmitting(false);
                    return;
                }

                const response = await clientsService.addNewContact(values);
                if (response.ok) {
                    const resMessage = await response.json();
                    const leadId = resMessage.leadsId;
                    fireEvent("event-form-submit", {
                        formName: "New Contact",
                    });
                    if (callLogId !== "undefined" && callLogId) {
                        const tagsArray = tags?.split(",").map(Number);
                        await callRecordingsService.assignsLeadToInboundCallRecord({
                            callLogId,
                            leadId,
                            isInbound: true,
                            tagIds: tagsArray, // tags from the url
                        });
                    }
                    fireEvent("Call Linked", {
                        leadid: leadId,
                    });

                    showToast({
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
                    showToast({
                        message: errMessage,
                        type: "error",
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
                submitCount,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
            }) => {
                const isInvalidZip =
                    (values.address.postalCode.length === 5 && !loadingCountyAndState && allStates?.length === 0) ||
                    (values.address.postalCode > 0 && values.address.postalCode.length < 5);

                const emailPhoneValid =
                    (!errors.email && values.email !== "") ||
                    (!errors.phones?.leadPhone && values.phones?.leadPhone !== "");

                const countyName = allCounties[0]?.value;
                const countyFipsName = allCounties[0]?.key;
                const stateCodeName = allStates[0]?.value;

                if (
                    allCounties.length === 1 &&
                    countyName !== values.address.county &&
                    countyFipsName !== values.address.countyFips
                ) {
                    setFieldValue("address.county", allCounties[0].value);
                    setFieldValue("address.countyFips", allCounties[0].key);
                }
                if (allStates.length === 1 && stateCodeName !== values.address.stateCode) {
                    setFieldValue("address.stateCode", allStates[0].value);
                }
                return (
                    <Form className="form mt-3">
                        <fieldset
                            ref={addNewDuplicateErrorRef}
                            className="form__fields form__fields--constrained hide-input-err"
                        >
                            <Textfield
                                id="contact-fname"
                                label="First Name"
                                placeholder={"Enter first name"}
                                name="firstName"
                                value={values.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={(touched.firstName || submitCount > 0) && errors.firstName ? true : false}
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
                                error={(touched.lastName || submitCount > 0) && errors.lastName ? true : false}
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
                                    (touched.address?.address1 || submitCount > 0) && errors.address?.address1
                                        ? true
                                        : false
                                }
                            />
                            {(touched.address?.address1 || submitCount > 0) && errors.address?.address1 && (
                                <ul className="details-edit-custom-error-msg">
                                    <li className="error-msg-red">{errors.address?.address1}</li>
                                </ul>
                            )}
                            {!showAddress2 && (
                                <h4 className="address--2" onClick={() => setShowAddress2(true)}>
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
                                            (touched.address?.address2 || submitCount > 0) && errors.address?.address2
                                                ? true
                                                : false
                                        }
                                    />
                                    {(touched.address?.address2 || submitCount > 0) && errors.address?.address2 && (
                                        <ul className="details-edit-custom-error-msg">
                                            <li className="error-msg-red">{errors.address?.address2}</li>
                                        </ul>
                                    )}
                                </>
                            )}
                            <div className="address__city__state__zip hide-input-err" style={{ display: "flex" }}>
                                <Textfield
                                    id="contact-address__city"
                                    className={`${styles["contact-address--city"]} mr-1`}
                                    label="City"
                                    name="address.city"
                                    value={values.address.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                        (touched.address?.city || submitCount > 0) && errors.address?.city
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
                                        fetchCountyAndState(e.target.value);
                                        if (e.target.value.length < 5) {
                                            setZipLengthValid(false);
                                        } else {
                                            setZipLengthValid(true);
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    onInput={(e) => {
                                        e.target.value = e.target.value
                                            .replace(/[^0-9]/g, "")
                                            .toString()
                                            .slice(0, 5);
                                    }}
                                    error={errors.address?.postalCode || isInvalidZip ? true : false}
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
                                                allStates.length > 1 && values.address.stateCode === "" ? true : false
                                            }
                                            onChange={(value) => setFieldValue("address.stateCode", value)}
                                            showValueAlways={true}
                                        />
                                    </div>
                                </div>

                                <div className="mob-res-mt-29 ml-10 custom-w-25 contact-details-col1">
                                    <label className=" custom-label-state label" htmlFor="phone-label">
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
                                                allCounties.length > 1 && values.address.county === "" ? true : false
                                            }
                                            onChange={(value) => {
                                                setFieldValue("address.county", value);
                                                const fip = allCounties.filter((item) => item.value === value)[0]?.key;
                                                setFieldValue("address.countyFips", fip);
                                            }}
                                            showValueAlways={true}
                                        />
                                    </div>
                                </div>
                            </div>
                            {(touched.address?.city || submitCount > 0) && errors.address?.city && (
                                <ul className="details-edit-custom-error-msg">
                                    <li className="error-msg-red">{errors.address?.city}</li>
                                </ul>
                            )}
                            {errors.address?.postalCode && (
                                <ul className="details-edit-custom-error-msg">
                                    <li className="error-msg-red zip-code-error-msg">{errors.address?.postalCode}</li>
                                </ul>
                            )}
                            {!errors.address?.postalCode &&
                                values.address.postalCode.length > 0 &&
                                !loadingCountyAndState &&
                                allStates?.length === 0 && (
                                    <ul className="details-edit-custom-error-msg">
                                        <li className="error-msg-red zip-code-error-msg">Invalid ZIP Code</li>
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
                                        onChange={(value) => setFieldValue("phones.phoneLabel", value)}
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
                                        <li className="error-msg-red">{errors?.medicareBeneficiaryID}</li>
                                    </ul>
                                )}
                            </div>

                            <div style={{ display: "flex" }}>
                                <div
                                    className="custom-w-186  contact-details-col1 mob-res-w-100"
                                    style={{ marginRight: "70px" }}
                                >
                                    <label className=" custom-label-state label">Part A Effective Date</label>

                                    <DatePickerMUI
                                        value={values.partA}
                                        onChange={(value) => {
                                            setFieldValue("partA", value);
                                        }}
                                        className={styles.disableDatePickerError}
                                    />
                                </div>
                                <div className="custom-w-186  contact-details-col1 mob-res-w-100">
                                    <label className=" custom-label-state label">Part B Effective Date</label>

                                    <DatePickerMUI
                                        value={values.partB === null ? "" : values.partB}
                                        onChange={(value) => {
                                            setFieldValue("partB", value);
                                        }}
                                        className={styles.disableDatePickerError}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        <div className="mt-3 mb-3 border-bottom border-bottom--light" />
                        <div>
                            {duplicateLeadIds?.length > 0 && (
                                <div className={`${styles["duplicate-lead"]} mt-5 mb-4`}>
                                    <div>
                                        <Warning />
                                    </div>
                                    <div className={`${styles["duplicate-lead--text"]} pl-1`}>
                                        You can create this contact, but the entry is a potential duplicate to{" "}
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
                                                onClick={handleMultipleDuplicates}
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
                                    disabled={!dirty || !isValid || isInvalidZip || !emailPhoneValid}
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
    const { state, search } = useLocation();

    const searchParams = new URLSearchParams(search);
    const tags = searchParams.get("tags"); // Retrieve the 'tags' query parameter

    const callLogIdNumber = callLogId ? Number(callLogId) : null;
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
                    <h3 className="hdg hdg--3 pt-3 pl-3 pb-2">Contact Details</h3>
                    <div className="border-bottom border-bottom--light"></div>
                    <NewContactForm
                        callLogId={callLogIdNumber}
                        firstName={firstName}
                        lastName={lastName}
                        state={state}
                        tags={tags}
                    />
                </Container>
            </div>
            <GlobalFooter />
        </>
    );
}
