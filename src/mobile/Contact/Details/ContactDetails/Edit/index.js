import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { Button } from "components/ui/Button";
import Textfield from "components/ui/textfield";
import Warning from "components/icons/warning";
import { Select } from "components/ui/Select";
import validationService from "services/validationService";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";
import { formatPhoneNumber } from "utils/phones";
import { formatDate } from "utils/dates";
import ContactRecordTypes from "utils/contactRecordTypes";
import analyticsService from "services/analyticsService";
import { onlyAlphabets, formatMbiNumber } from "utils/shared-utils/sharedUtility";
import useFilteredLeadIds from "pages/ContactsList/hooks/useFilteredLeadIds";
import CountyContext from "contexts/counties";
import DatePickerMUI from "components/DatePicker";
import styles from "./styles.module.scss";

const PrimaryContactTypes = [
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
];

const EditDetails = (props) => {
    const { setFilteredDataHandle } = useFilteredLeadIds();

    const {
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
        medicareBeneficiaryID = "",
        partA = "",
        partB = "",
    } = props.personalInfo;

    const { allCounties = [], allStates = [], fetchCountyAndState } = useContext(CountyContext);
    const email = emails.length > 0 ? emails[0].leadEmail : null;
    const phoneData = phones.length > 0 ? phones[0] : null;
    const addressData = addresses.length > 0 ? addresses?.[0] : null;
    const emailID = emails.length > 0 ? emails[0].emailID : 0;
    const leadAddressId = addressData && addressData.leadAddressId ? addressData.leadAddressId : 0;
    const phoneId = phoneData && phoneData.phoneId ? phoneData.phoneId : 0;

    const city = addressData && addressData.city ? addressData.city : "";
    const stateCode = addressData && addressData.stateCode ? addressData.stateCode : "";
    const address1 = addressData && addressData.address1 ? addressData.address1 : "";
    const address2 = addressData && addressData.address2 ? addressData.address2 : "";
    const county = addressData && addressData.county ? addressData.county : "";
    const countyFips = addressData && addressData.countyFips ? addressData.countyFips : "";
    const postalCode = addressData && addressData.postalCode ? addressData.postalCode : "";
    const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";
    const phoneLabel = phoneData && phoneData.phoneLabel ? phoneData.phoneLabel : "mobile";

    const isPrimary = contactPreferences?.primary ? contactPreferences?.primary : "email";

    const showToast = useToast();
    const [duplicateLeadIds, setDuplicateLeadIds] = useState([]);

    const navigate = useNavigate();
    const { clientsService } = useClientServiceContext();

    const isDuplicateContact = useCallback(async (values, setDuplicateLeadIds, errors = {}, leadsId) => {
        if (Object.keys(errors).length) {
            return {
                ...errors,
                isExactDuplicate: true,
            };
        } else {
            const response = await clientsService.getDuplicateContact(values);
            if (response.ok) {
                const resMessage = await response.json();
                const duplicateLeadIds = resMessage.duplicateLeadIds.filter((id) => leadsId !== id);

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
    }, []);

    const getContactLink = (id) => `/contact/${id}`;
    const goToContactDetailPage = (id) => {
        if (duplicateLeadIds.length) {
            return navigate(getContactLink(id).concat(`/duplicate/${duplicateLeadIds[0]}`));
        }
        navigate(getContactLink(id));
    };

    const handleMultileDuplicates = () => {
        if (duplicateLeadIds.length) {
            setFilteredDataHandle("duplicateLeadIds", "editContact", duplicateLeadIds, null);
        }
        return true;
    };

    useEffect(() => {
        fetchCountyAndState(postalCode);
    }, [fetchCountyAndState, postalCode]);

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
                medicareBeneficiaryID: medicareBeneficiaryID ? formatMbiNumber(medicareBeneficiaryID) : "",
                partA: partA ?? "",
                partB: partB ?? "",
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
                        },
                        {
                            name: "birthdate",
                            validator: validationService.validateDateInput,
                            args: ["Date of Birth", "MM/dd/yyyy"],
                        },
                        {
                            name: "medicareBeneficiaryID",
                            validator: validationService.validateMedicalBeneficiaryId,
                            args: ["Medicare Beneficiary ID Number"],
                        },
                    ],
                    values
                );
                return await isDuplicateContact(values, setDuplicateLeadIds, errors, leadsId);
            }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
                setSubmitting(true);
                const response = await clientsService.updateLead(values);
                if (response.ok) {
                    props.getContactRecordInfo();
                    if (props.successNavigationRoute) {
                        navigate(props.successNavigationRoute);
                    } else {
                        goToContactDetailPage(leadsId);
                    }
                    props.setEdit(false);
                    setSubmitting(false);
                    showToast({
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
            {({ values, errors, touched, isValid, dirty, handleChange, handleBlur, handleSubmit, setFieldValue }) => {
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
                    <Form className=" ">
                        <div className={styles.detailsEdit}>
                            <div className={styles.inputContainer}>
                                <div className={styles.label}>First Name</div>

                                <Textfield
                                    id="contact-fname"
                                    placeholder={"Enter first name"}
                                    name="firstName"
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

                            <div className={styles.inputContainer}>
                                <div className={styles.label}>Middle Initial</div>
                                <Textfield
                                    id="contact-mname"
                                    type="text"
                                    placeholder=""
                                    maxLength="1"
                                    name="middleName"
                                    onKeyDown={onlyAlphabets}
                                    value={values.middleName?.toUpperCase()}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <div className={styles.label}>Last Name</div>

                                <Textfield
                                    id="contact-lname"
                                    placeholder="Enter last name"
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
                        </div>
                        <div className={styles.detailsEdit}>
                            <div className={styles.inputContainer}>
                                <div className={styles.label}>Birthdate</div>
                                <DatePickerMUI
                                    value={values.birthdate}
                                    disableFuture={true}
                                    onChange={(value) => {
                                        setFieldValue("birthdate", formatDate(value));
                                    }}
                                    isMobile={true}
                                />

                                {errors.birthdate && (
                                    <ul className="details-edit-custom-error-msg">
                                        <li className="error-msg-red">{errors.birthdate}</li>
                                    </ul>
                                )}
                            </div>

                            <div className={styles.inputContainer}>
                                <div className={styles.label}>Email</div>
                                <Textfield
                                    id="contact-email"
                                    type="email"
                                    placeholder="Enter email address"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.email && errors.email}
                                />
                            </div>
                        </div>
                        <div className={styles.detailsEdit}>
                            <div className={styles.inputContainer}>
                                <div className={styles.label}>Street Address</div>

                                <Textfield
                                    id="contact-address"
                                    placeholder={"Enter street address"}
                                    name="address.address1"
                                    value={values.address.address1}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.address?.address1 ? true : false}
                                />
                                {touched.address?.address1 && errors.address?.address1 && (
                                    <ul className="details-edit-custom-error-msg">
                                        <li className="error-msg-red">{errors.address?.address1}</li>
                                    </ul>
                                )}
                            </div>

                            <div className={styles.inputContainer}>
                                <div className={styles.label}>Apt, suite, etc (optional)</div>
                                <Textfield
                                    id="contact-address2"
                                    placeholder={"Enter Apt, Suite, Unit"}
                                    name="address.address2"
                                    value={values.address.address2}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.address?.address2 ? true : false}
                                />
                                {touched.address?.address2 && errors.address?.address2 && (
                                    <ul className="details-edit-custom-error-msg">
                                        <li className="error-msg-red">{errors.address?.address2}</li>
                                    </ul>
                                )}
                            </div>

                            <div className={styles.inputContainer}>
                                <div className={styles.label}>City</div>
                                <Textfield
                                    id="contact-address__city"
                                    name="address.city"
                                    value={values.address.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.address?.city ? true : false}
                                />
                                {touched.address?.city && errors.address?.city && (
                                    <ul className="details-edit-custom-error-msg">
                                        <li className="error-msg-red">{errors.address?.city}</li>
                                    </ul>
                                )}
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.label}>ZIP Code</div>
                                    <Textfield
                                        id="contact-address__zip"
                                        name="address.postalCode"
                                        value={values.address.postalCode}
                                        inputprops={{ maxLength: 5 }}
                                        onChange={(e) => {
                                            setFieldValue("address.postalCode", e.target.value);
                                            setFieldValue("address.county", "");
                                            setFieldValue("address.stateCode", "");
                                            fetchCountyAndState(e.target.value);
                                        }}
                                        onBlur={handleBlur}
                                        onInput={(e) => {
                                            e.target.value = e.target.value
                                                .replace(/[^0-9]/g, "")
                                                .toString()
                                                .slice(0, 5);
                                        }}
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
                                <div className={styles.inputContainer}>
                                    <div className={styles.label}>State</div>
                                    <Select
                                        placeholder="select"
                                        showValueAsLabel={true}
                                        disabled={true}
                                        options={allStates}
                                        isDefaultOpen={
                                            allStates.length > 1 && values.address.stateCode === "" ? true : false
                                        }
                                        initialValue={values.address.stateCode}
                                        onChange={(value) => {
                                            setFieldValue("address.stateCode", value);
                                        }}
                                        showValueAlways={true}
                                        page={"editDetails"}
                                    />
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <div className={styles.label}>County</div>
                                <Select
                                    placeholder="select"
                                    showValueAsLabel={true}
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
                                    page={"editDetails"}
                                />
                            </div>
                        </div>

                        <div className={styles.detailsEdit}>
                            <div className={styles.inputRow}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.label}>Phone</div>
                                    <Textfield
                                        id="contact-phone"
                                        type="tel"
                                        placeholder="(   )_ _ _  - _ _ _ _ "
                                        name="phones.leadPhone"
                                        value={formatPhoneNumber(values.phones.leadPhone)}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.phones?.leadPhone && errors.phones?.leadPhone}
                                    />
                                </div>
                                <div className={styles.inputContainer}>
                                    <div className={styles.label}>Contact Type</div>
                                    <Select
                                        placeholder="select"
                                        options={ContactRecordTypes}
                                        initialValue={values.contactRecordType}
                                        onChange={(value) => setFieldValue("contactRecordType", value)}
                                        showValueAlways={true}
                                        page={"editDetails"}
                                    />
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <div className={styles.label}>Primary Contact</div>
                                <Select
                                    placeholder="select"
                                    options={PrimaryContactTypes}
                                    initialValue={values.primaryCommunication}
                                    onChange={(value) => setFieldValue("primaryCommunication", value)}
                                    showValueAlways={true}
                                    page={"editDetails"}
                                />
                            </div>
                        </div>
                        <div className={styles.detailsEdit}>
                            <div className={styles.inputContainer}>
                                <div className={styles.label}>Medicare Beneficiary ID Number</div>
                                <Textfield
                                    id="mbi-number"
                                    type="text"
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
                            <div className={styles.inputContainer}>
                                <div className={styles.label}>Part A Effective Date</div>

                                <DatePickerMUI
                                    value={values.partA === null ? "" : values.partA}
                                    onChange={(value) => {
                                        setFieldValue("partA", value);
                                    }}
                                    className={styles.disableDatePickerError}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <div className={styles.label}>Part B Effective Date</div>

                                <DatePickerMUI
                                    value={values.partB === null ? "" : values.partB}
                                    onChange={(value) => {
                                        setFieldValue("partB", value);
                                    }}
                                    className={styles.disableDatePickerError}
                                />
                            </div>
                        </div>
                        {duplicateLeadIds?.length > 0 && (
                            <div className="duplicate  mb-1">
                                <div>
                                    <Warning />
                                </div>
                                <div className="duplicate-text pl-1">
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
                                            onClick={handleMultileDuplicates}
                                        >
                                            {" "}
                                            view duplicates
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className={styles.buttonRow}>
                            <Button
                                className={styles.button}
                                label="Cancel"
                                onClick={() => props.setEdit(false)}
                                type={"secondary"}
                            />
                            <Button
                                className={styles.button}
                                label="Save Changes"
                                disabled={!dirty || !isValid}
                                onClick={handleSubmit}
                            />
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default EditDetails;
