import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import { useClientServiceContext } from "services/clientServiceProvider";
import { Select } from "components/ui/Select";
import Checkbox from "components/ui/Checkbox";
import Textfield from "components/ui/textfield";
import { Button } from "components/ui/Button";
import Container from "components/ui/container";
import Info from "components/icons/info-small";
import Card from "components/ui/card";
import WithLoader from "components/ui/WithLoader";
import { onlyAlphabets } from "utils/shared-utils/sharedUtility";
import { formatPhoneNumber } from "utils/phones";
import { STATES } from "utils/address";
import Navigation from "partials/blue-nav-with-icon";
import WhoIsAuthorizedRepresentative from "./WhoIsAuthorizedRepresentative";
import MedicareOverviewCard from "./MedicareOverviewCard";
import FormAlreadySubmitted from "./FormAlreadySubmitted";
import analyticsService from "services/analyticsService";
import { formValidator } from "./FormValidator";
import "./index.scss";

const ScopeOfAppointmentConfirmation = () => {
    const { linkCode } = useParams();
    const navigate = useNavigate();
    const showToast = useToast();
    const medicareOverviewSectionEl = useRef(null);
    const [products, setProducts] = useState({});
    const [soaStatus, setSOAStatus] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [openAuthorizedHelpModal, setOpenAuthorizedHelpModal] = useState(false);
    const [leadInfo, setLeadInfo] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        phone: "",
        address: {
            address1: "",
            address2: "",
            city: "",
            stateCode: "",
            postalCode: "",
        },
    });
    const { clientsService } = useClientServiceContext();

    useEffect(() => {
        const getStatus = async () => {
            setLoading(true);
            try {
                const data = await clientsService.getSoaStatusByLinkCode(linkCode);
                setSOAStatus(data);

                const leadObject = data?.leadSection?.beneficiary || null;
                const products = data?.leadSection?.products || [];

                if (products?.length > 0) {
                    const convertedObject = Object.fromEntries(products?.map((item) => [item, true]));
                    setProducts(convertedObject);
                }

                if (leadObject) {
                    const { firstName, lastName, middleName, phone, address1, address2, city, state, zip } = leadObject;
                    setLeadInfo({
                        ...leadInfo,
                        firstName,
                        lastName,
                        middleName,
                        phone,
                        address: {
                            address1,
                            address2,
                            city,
                            stateCode: state,
                            postalCode: zip,
                        },
                    });
                }
            } catch (err) {
                showToast({
                    type: "error",
                    message: "Failed to fetch data",
                    time: 10000,
                });
            } finally {
                setLoading(false);
            }
        };
        if (linkCode) {
            getStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [linkCode]);

    const showMedicareOverview = () => {
        medicareOverviewSectionEl.current.scrollIntoView({
            behavior: "smooth",
        });
    };
    const handlePlanTypes = (e) => {
        const { value, checked } = e.target;
        setProducts((products) => ({
            ...products,
            [value]: checked,
        }));
    };

    const confirmationForm = (
        <Formik
            initialValues={{
                ...leadInfo,
                hasAuthorizedRepresentative: false,
                authorizedRepresentative: {
                    firstName: "",
                    lastName: "",
                    middleName: "",
                    phone: "",
                    address: {
                        address1: "",
                        address2: "",
                        city: "",
                        stateCode: "",
                        postalCode: "",
                    },
                    relationshipToBeneficiary: "",
                    acceptedSOA: false,
                },
            }}
            validate={formValidator}
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                try {
                    const {
                        firstName,
                        lastName,
                        middleName,
                        hasAuthorizedRepresentative,
                        address,
                        phone,
                        authorizedRepresentative,
                        products = {},
                        acceptedSOA,
                    } = values;
                    const { agentSection } = soaStatus;
                    const checkedProducts = Object.keys(products).filter((key) => products[key] === true);
                    const authorizedRepresentativeData = hasAuthorizedRepresentative
                        ? {
                              authorizedRepresentative: {
                                  firstName: authorizedRepresentative.firstName,
                                  middleName: authorizedRepresentative.middleName,
                                  lastName: authorizedRepresentative.lastName,
                                  address1: authorizedRepresentative.address.address1,
                                  address2: authorizedRepresentative.address.address2,
                                  city: authorizedRepresentative.address.city,
                                  state: authorizedRepresentative.address.stateCode,
                                  zip: authorizedRepresentative.address.postalCode,
                                  phone: authorizedRepresentative.phone,
                                  relationshipToBeneficiary: authorizedRepresentative.relationshipToBeneficiary,
                              },
                          }
                        : {};
                    const response = await clientsService.saveSoaInformationForLeadByLinkCode(
                        {
                            leadSection: {
                                products: checkedProducts,
                                beneficiary: {
                                    firstName,
                                    middleName,
                                    lastName,
                                    address1: address.address1,
                                    address2: address.address2,
                                    city: address.city,
                                    state: address.stateCode,
                                    zip: address.postalCode,
                                    phone: phone,
                                },
                                hasAuthorizedRepresentative,
                                ...authorizedRepresentativeData,
                                acceptedSOA,
                                submittedDateTime: new Date().toISOString(),
                            },
                            agentSection: { ...agentSection },
                        },
                        linkCode
                    );
                    if (response.ok) {
                        analyticsService.fireEvent("event-form-submit-valid", {
                            formName: "Scope of Appointment Agent Complete",
                        });
                        navigate(`/soa-confirmation-page/${agentSection?.firstName}/${agentSection?.lastName}`);
                    }
                } catch (err) {
                    Sentry.captureException(err);
                    showToast({
                        type: "error",
                        message: "Failed to submit SOA",
                    });
                } finally {
                    setSubmitting(false);
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
                setFieldTouched,
            }) => {
                return (
                    <>
                        <WhoIsAuthorizedRepresentative
                            isOpen={openAuthorizedHelpModal}
                            onClose={() => setOpenAuthorizedHelpModal(false)}
                        />
                        <div className="soa-confirmation-form-page">
                            <Container className="soa-confirmation-form-wrapper">
                                <Card className="soa-confirmation-card">
                                    <Form className="form mt-3">
                                        <div className="soa-confirmation-title">
                                            Scope of Appointment Confirmation Form
                                        </div>
                                        <section className="section-1">
                                            The Centers for Medicare and Medicaid Services requires agents to document
                                            the scope of a marketing appointment prior to any face-to-face sales meeting
                                            to ensure understanding of what will be discussed between the agent and the
                                            Medicare beneficiary (or their authorized representative). All information
                                            provided on this form is confidential and should be completed by each person
                                            with Medicare or his/her authorized representative.
                                        </section>
                                        <section data-gtm="section-products" className="section-2">
                                            <span className="plan-types">Please check all associated plan types:</span>
                                            <div className="plan-types-checkbox">
                                                <Checkbox
                                                    className="pt-2"
                                                    label={"Medicare Advantage (Part C)"}
                                                    value="MedicareAdvantage"
                                                    checked={products["MedicareAdvantage"]}
                                                    onChange={handlePlanTypes}
                                                />
                                                <Checkbox
                                                    className="pt-2"
                                                    label={"Medicare Supplement (Medigap)"}
                                                    value="MedicareSupplement"
                                                    checked={products["MedicareSupplement"]}
                                                    onChange={handlePlanTypes}
                                                />
                                                <Checkbox
                                                    className="pt-2"
                                                    label={"Medicare Prescription (Part D)"}
                                                    value="MedicarePrescriptionDrug"
                                                    checked={products["MedicarePrescriptionDrug"]}
                                                    onChange={handlePlanTypes}
                                                />
                                                <Checkbox
                                                    className="pt-2"
                                                    label={"Ancillary Products"}
                                                    value="AncilaryProducts"
                                                    checked={products["AncilaryProducts"]}
                                                    onChange={handlePlanTypes}
                                                />
                                            </div>
                                            <div className="plan-type-help pt-4">
                                                Not sure what you need?{" "}
                                                <a
                                                    className="blue-link"
                                                    href={() => false}
                                                    onClick={showMedicareOverview}
                                                >
                                                    View Medicare product descriptions
                                                </a>
                                            </div>
                                        </section>
                                        <section className="section-3">
                                            <span className="signing-form-1">
                                                By signing this form, you agree to a meeting with a sales agent to
                                                discuss the types of products you indicated above. Please note, the
                                                person who will discuss the products is either employed or contracted by
                                                a Medicare plan. They do not work directly for the federal government.
                                                This individual may also be paid based on your enrollment in a plan.
                                            </span>
                                            <br />
                                            <br />
                                            <span className="signing-form-2">
                                                Signing this form does NOT obligate you to enroll in a plan, affect your
                                                current enrollment, or enroll you in a Medicare plan.
                                            </span>
                                        </section>
                                        <section className="beneficiary-details">
                                            <div className="heading-text">Please fill out the following details:</div>
                                            <div className="person-enrolled">
                                                <div className="icon-info-small">
                                                    <Info />
                                                </div>
                                                <span>
                                                    Each person enrolled in Medicare receives a Medicare Beneficiary
                                                    Identifier number (MBI) on their Medicare card.{" "}
                                                    <strong>
                                                        Enter the information of the primary Medicare beneficiary
                                                    </strong>{" "}
                                                    (cardholder).
                                                </span>
                                            </div>
                                            <div className="mandatory-notes-div">* Indicates a required field</div>
                                            <section data-gtm="section-beneficiary-info" className="beneficiary-form">
                                                <fieldset className="form__fields form__fields--constrained hide-input-err">
                                                    <Textfield
                                                        id="beneficiary-fname"
                                                        label="Beneficiary's First Name *"
                                                        name="firstName"
                                                        value={values.firstName}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={
                                                            (touched.firstName || submitCount > 0) && errors.firstName
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {(touched.firstName || submitCount > 0) && errors.firstName && (
                                                        <>
                                                            <ul className="details-edit-custom-error-msg">
                                                                <li className="error-msg-green">
                                                                    First name must be 2 characters or more
                                                                </li>
                                                                <li className="error-msg-green">
                                                                    Only alpha numerics and space, apostrophe('),
                                                                    hyphen(-) are allowed
                                                                </li>
                                                                <li className="error-msg-red">
                                                                    Certain special characters such as ! @ . , ; : " ?
                                                                    are not allowed
                                                                </li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {values.firstName.length > 50 && (
                                                        <div className="custom-error-msg">
                                                            First name must be 50 characters or less
                                                        </div>
                                                    )}
                                                    <Textfield
                                                        id="beneficiary-mname"
                                                        label="Beneficiary's Middle Initial (optional)"
                                                        className="user-middle-name"
                                                        name="middleName"
                                                        onKeyDown={onlyAlphabets}
                                                        maxLength="1"
                                                        value={values.middleName?.toUpperCase()}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Textfield
                                                        id="beneficiary-lname"
                                                        className="pb-2"
                                                        label="Beneficiary's Last Name *"
                                                        name="lastName"
                                                        value={values.lastName}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={
                                                            (touched.lastName || submitCount > 0) && errors.lastName
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {(touched.lastName || submitCount > 0) && errors.lastName && (
                                                        <>
                                                            <ul className="details-edit-custom-error-msg">
                                                                <li className="error-msg-green">
                                                                    Last name must be 2 characters or more
                                                                </li>
                                                                <li className="error-msg-green">
                                                                    Only alpha numerics and space, apostrophe('),
                                                                    hyphen(-) are allowed
                                                                </li>
                                                                <li className="error-msg-red">
                                                                    Certain special characters such as ! @ . , ; : " ?
                                                                    are not allowed
                                                                </li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {values.lastName.length > 50 && (
                                                        <div className="custom-error-msg">
                                                            Last name must be 50 characters or less
                                                        </div>
                                                    )}
                                                </fieldset>
                                                <fieldset className="form__fields form__fields--constrained hide-input-err">
                                                    <Textfield
                                                        id="beneficiary-address"
                                                        label="Address Line1 *"
                                                        name="address.address1"
                                                        value={values.address.address1}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={
                                                            (touched.address?.address1 || submitCount > 0) &&
                                                            errors.address?.address1
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {(touched.address?.address1 || submitCount > 0) &&
                                                        errors.address?.address1 && (
                                                            <>
                                                                <ul className="details-edit-custom-error-msg">
                                                                    <li className="error-msg-green">
                                                                        Address must be 4 characters or more
                                                                    </li>
                                                                    <li className="error-msg-green">
                                                                        Only alpha numerics and certain special
                                                                        characters such as # ' . - are allowed
                                                                    </li>
                                                                </ul>
                                                            </>
                                                        )}
                                                    <Textfield
                                                        id="beneficiary-address2"
                                                        label="Address Line2"
                                                        name="address.address2"
                                                        value={values.address.address2}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={
                                                            (touched.address?.address2 || submitCount > 0) &&
                                                            errors.address?.address2
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {(touched.address?.address2 || submitCount > 0) &&
                                                        errors.address?.address2 && (
                                                            <>
                                                                <ul className="details-edit-custom-error-msg">
                                                                    <li className="error-msg-green">
                                                                        Address must be 4 characters or more
                                                                    </li>
                                                                    <li className="error-msg-green">
                                                                        Only alpha numerics and certain special
                                                                        characters such as # ' . - are allowed
                                                                    </li>
                                                                </ul>
                                                            </>
                                                        )}
                                                    <Textfield
                                                        id="beneficiary-address__city"
                                                        label="City *"
                                                        name="address.city"
                                                        value={values.address.city}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={
                                                            (touched.address?.city || submitCount > 0) &&
                                                            errors.address?.city
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {(touched.address?.city || submitCount > 0) &&
                                                        errors.address?.city && (
                                                            <>
                                                                <ul className="details-edit-custom-error-msg">
                                                                    <li className="error-msg-green">
                                                                        City must be 4 characters or more
                                                                    </li>
                                                                    <li className="error-msg-green">
                                                                        Only alpha numerics and certain special
                                                                        characters such as # ' . - are allowed
                                                                    </li>
                                                                </ul>
                                                            </>
                                                        )}
                                                    <div>
                                                        <label className="label" htmlFor="state-label">
                                                            State *
                                                        </label>
                                                        <div className="state-select-input">
                                                            <Select
                                                                placeholder="Select state"
                                                                showValueAsLabel={true}
                                                                options={STATES}
                                                                initialValue={values.address.stateCode}
                                                                onChange={(value) => {
                                                                    setTimeout(() =>
                                                                        setFieldValue("address.stateCode", value)
                                                                    );
                                                                }}
                                                                onBlur={() => {
                                                                    setFieldTouched("address.stateCode", true);
                                                                }}
                                                                showValueAlways={true}
                                                                error={
                                                                    (touched.address?.stateCode || submitCount > 0) &&
                                                                    errors.address?.stateCode
                                                                        ? true
                                                                        : false
                                                                }
                                                            />
                                                        </div>
                                                        {errors.address?.stateCode &&
                                                            (touched.address?.stateCode || submitCount > 0) && (
                                                                <ul className="details-edit-custom-error-msg">
                                                                    <li className="error-msg-red zip-code-error-msg">
                                                                        State must be required
                                                                    </li>
                                                                </ul>
                                                            )}
                                                    </div>
                                                    <Textfield
                                                        id="beneficiary-address__zip"
                                                        className={`contact-address--zip`}
                                                        label="ZIP Code *"
                                                        name="address.postalCode"
                                                        value={values.address.postalCode}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={
                                                            (touched.address?.postalCode || submitCount > 0) &&
                                                            errors.address?.postalCode
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {errors.address?.postalCode &&
                                                        (touched.address?.postalCode || submitCount > 0) && (
                                                            <ul className="details-edit-custom-error-msg">
                                                                <li className="error-msg-red ">
                                                                    {errors.address?.postalCode}
                                                                </li>
                                                            </ul>
                                                        )}
                                                </fieldset>
                                                <fieldset className="form__fields form__fields--constrained hide-input-err">
                                                    <Textfield
                                                        id="beneficiary-phone"
                                                        className={`pt-2`}
                                                        label="Phone Number (optional)"
                                                        type="tel"
                                                        placeholder="(XXX) XXX-XXXX"
                                                        name="phone"
                                                        value={formatPhoneNumber(values.phone, true)}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={errors.phone ? true : false}
                                                    />
                                                    {errors.phone && (touched.phone || submitCount > 0) && (
                                                        <ul className="details-edit-custom-error-msg">
                                                            <li className="error-msg-red ">
                                                                Phone Number must be a valid 10-digit phone number
                                                            </li>
                                                        </ul>
                                                    )}
                                                </fieldset>
                                                <div className="authorized-representative-wrapper">
                                                    <span>
                                                        Are you the authorized representative acting on behalf of the
                                                        benificiary?
                                                    </span>
                                                    <a
                                                        href={() => false}
                                                        onClick={() => setOpenAuthorizedHelpModal(true)}
                                                        className="help"
                                                    >
                                                        Who is an authorized representative?
                                                    </a>
                                                </div>
                                                <div className="is-authorized-flag">
                                                    <Checkbox
                                                        label={"Yes"}
                                                        name="hasAuthorizedRepresentative"
                                                        checked={values.hasAuthorizedRepresentative}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                {!values.hasAuthorizedRepresentative && (
                                                    <div className="understand-contents-of-soa">
                                                        <Checkbox
                                                            className="understand-contents-of-soa-checkbox"
                                                            name="acceptedSOA"
                                                            checked={values.acceptedSOA}
                                                            onChange={handleChange}
                                                        />
                                                        <div className="understand-contents-of-soa-content">
                                                            By checking this box, I have read and understand the
                                                            contents of the Scope of Appointment form, and that I
                                                            confirm that the information I have provided is accurate. If
                                                            submitted by an authorized individual (as described above),
                                                            this submission certifies that 1) this person is authorized
                                                            under State law to complete the Scope of Appointment form,
                                                            and 2) documentation of this authority is available upon
                                                            request by Medicare.
                                                        </div>
                                                    </div>
                                                )}
                                            </section>
                                            {values.hasAuthorizedRepresentative && (
                                                <section
                                                    data-gtm="section-agent-info"
                                                    className="authorized-representative-form"
                                                >
                                                    <div className="authorized-representative-fill-form pt-2 pb-2">
                                                        Please fill out the following details as the Authorized
                                                        Representative:
                                                    </div>
                                                    <fieldset className="form__fields form__fields--constrained hide-input-err">
                                                        <Textfield
                                                            id="representative-fname"
                                                            label="Authorized Representative’s  First Name *"
                                                            name="authorizedRepresentative.firstName"
                                                            value={values?.authorizedRepresentative?.firstName}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={
                                                                (touched.authorizedRepresentative?.firstName ||
                                                                    submitCount > 0) &&
                                                                errors?.authorizedRepresentative?.firstName
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {(touched.authorizedRepresentative?.firstName ||
                                                            submitCount > 0) &&
                                                            errors?.authorizedRepresentative?.firstName && (
                                                                <>
                                                                    <ul className="details-edit-custom-error-msg">
                                                                        <li className="error-msg-green">
                                                                            First name must be 2 characters or more
                                                                        </li>
                                                                        <li className="error-msg-green">
                                                                            Only alpha numerics and space,
                                                                            apostrophe('), hyphen(-) are allowed
                                                                        </li>
                                                                        <li className="error-msg-red">
                                                                            Certain special characters such as ! @ . , ;
                                                                            : " ? are not allowed
                                                                        </li>
                                                                    </ul>
                                                                </>
                                                            )}
                                                        {values?.authorizedRepresentative?.firstName.length > 50 && (
                                                            <div className="custom-error-msg">
                                                                First name must be 50 characters or less
                                                            </div>
                                                        )}

                                                        <Textfield
                                                            id="representative-mname"
                                                            className="user-middle-name"
                                                            label="Authorized Representative’s  Middle Initial"
                                                            name="authorizedRepresentative.middleName"
                                                            onKeyDown={onlyAlphabets}
                                                            maxLength="1"
                                                            value={values?.authorizedRepresentative?.middleName?.toUpperCase()}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                        <Textfield
                                                            id="contact-lname"
                                                            className="pb-2"
                                                            label="Authorized Representative’s Last Name *"
                                                            name="authorizedRepresentative.lastName"
                                                            value={values?.authorizedRepresentative?.lastName}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={
                                                                (touched.authorizedRepresentative?.lastName ||
                                                                    submitCount > 0) &&
                                                                errors?.authorizedRepresentative?.lastName
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {(touched.authorizedRepresentative?.lastName ||
                                                            submitCount > 0) &&
                                                            errors?.authorizedRepresentative?.lastName && (
                                                                <>
                                                                    <ul className="details-edit-custom-error-msg">
                                                                        <li className="error-msg-green">
                                                                            Last name must be 2 characters or more
                                                                        </li>
                                                                        <li className="error-msg-green">
                                                                            Only alpha numerics and space,
                                                                            apostrophe('), hyphen(-) are allowed
                                                                        </li>
                                                                        <li className="error-msg-red">
                                                                            Certain special characters such as ! @ . , ;
                                                                            : " ? are not allowed
                                                                        </li>
                                                                    </ul>
                                                                </>
                                                            )}
                                                        {values?.authorizedRepresentative?.lastName.length > 50 && (
                                                            <div className="custom-error-msg">
                                                                Last name must be 50 characters or less
                                                            </div>
                                                        )}
                                                    </fieldset>
                                                    <fieldset className="form__fields form__fields--constrained hide-input-err">
                                                        <Textfield
                                                            id="representative-address"
                                                            label="Address Line1 *"
                                                            name="authorizedRepresentative.address.address1"
                                                            value={values?.authorizedRepresentative?.address?.address1}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={
                                                                (touched.authorizedRepresentative?.address?.address1 ||
                                                                    submitCount > 0) &&
                                                                errors?.authorizedRepresentative?.address?.address1
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {(touched.authorizedRepresentative?.address?.address1 ||
                                                            submitCount > 0) &&
                                                            errors?.authorizedRepresentative?.address?.address1 && (
                                                                <>
                                                                    <ul className="details-edit-custom-error-msg">
                                                                        <li className="error-msg-green">
                                                                            Address must be 4 characters or more
                                                                        </li>
                                                                        <li className="error-msg-green">
                                                                            Only alpha numerics and certain special
                                                                            characters such as # ' . - are allowed
                                                                        </li>
                                                                    </ul>
                                                                </>
                                                            )}
                                                        <Textfield
                                                            id="representative-address2"
                                                            label="Address Line2"
                                                            name="authorizedRepresentative.address.address2"
                                                            value={values?.authorizedRepresentative?.address?.address2}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={
                                                                (touched.authorizedRepresentative?.address?.address2 ||
                                                                    submitCount > 0) &&
                                                                errors?.authorizedRepresentative?.address?.address2
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {(touched.authorizedRepresentative?.address?.address2 ||
                                                            submitCount > 0) &&
                                                            errors?.authorizedRepresentative?.address?.address2 && (
                                                                <>
                                                                    <ul className="details-edit-custom-error-msg">
                                                                        <li className="error-msg-green">
                                                                            Address must be 4 characters or more
                                                                        </li>
                                                                        <li className="error-msg-green">
                                                                            Only alpha numerics and certain special
                                                                            characters such as # ' . - are allowed
                                                                        </li>
                                                                    </ul>
                                                                </>
                                                            )}
                                                        <Textfield
                                                            id="representative-address__city"
                                                            label="City *"
                                                            name="authorizedRepresentative.address.city"
                                                            value={values?.authorizedRepresentative?.address?.city}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={
                                                                (touched.authorizedRepresentative?.address?.city ||
                                                                    submitCount > 0) &&
                                                                errors?.authorizedRepresentative?.address?.city
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {(touched.authorizedRepresentative?.address?.city ||
                                                            submitCount > 0) &&
                                                            errors?.authorizedRepresentative?.address?.city && (
                                                                <>
                                                                    <ul className="details-edit-custom-error-msg">
                                                                        <li className="error-msg-green">
                                                                            City must be 4 characters or more
                                                                        </li>
                                                                        <li className="error-msg-green">
                                                                            Only alpha numerics and certain special
                                                                            characters such as # ' . - are allowed
                                                                        </li>
                                                                    </ul>
                                                                </>
                                                            )}
                                                        <div>
                                                            <label
                                                                className="label"
                                                                htmlFor="state-label-representative"
                                                            >
                                                                State *
                                                            </label>
                                                            <div className="state-select-input">
                                                                <Select
                                                                    placeholder="Select state"
                                                                    showValueAsLabel={true}
                                                                    options={STATES}
                                                                    initialValue={
                                                                        values?.authorizedRepresentative?.address
                                                                            ?.stateCode
                                                                    }
                                                                    onChange={(value) =>
                                                                        setTimeout(() =>
                                                                            setFieldValue(
                                                                                "authorizedRepresentative.address.stateCode",
                                                                                value
                                                                            )
                                                                        )
                                                                    }
                                                                    onBlur={() =>
                                                                        setFieldTouched(
                                                                            "authorizedRepresentative.address.stateCode",
                                                                            true
                                                                        )
                                                                    }
                                                                    showValueAlways={true}
                                                                    error={
                                                                        (touched.authorizedRepresentative?.address
                                                                            ?.stateCode ||
                                                                            submitCount > 0) &&
                                                                        errors.authorizedRepresentative?.address
                                                                            ?.stateCode
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                            </div>
                                                            {errors.authorizedRepresentative?.address?.stateCode &&
                                                                (touched.authorizedRepresentative?.address?.stateCode ||
                                                                    submitCount > 0) && (
                                                                    <ul className="details-edit-custom-error-msg">
                                                                        <li className="error-msg-red zip-code-error-msg">
                                                                            State must be required
                                                                        </li>
                                                                    </ul>
                                                                )}
                                                        </div>
                                                        <Textfield
                                                            id="contact-address__zip"
                                                            className={`contact-address--zip`}
                                                            label="ZIP Code *"
                                                            name="authorizedRepresentative.address.postalCode"
                                                            value={
                                                                values?.authorizedRepresentative?.address?.postalCode
                                                            }
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={
                                                                (touched.authorizedRepresentative?.address
                                                                    ?.postalCode ||
                                                                    submitCount > 0) &&
                                                                errors?.authorizedRepresentative?.address?.postalCode
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {(touched.authorizedRepresentative?.address?.postalCode ||
                                                            submitCount > 0) &&
                                                            errors?.authorizedRepresentative?.address?.postalCode && (
                                                                <ul className="details-edit-custom-error-msg">
                                                                    <li className="error-msg-red ">
                                                                        {
                                                                            errors?.authorizedRepresentative?.address
                                                                                ?.postalCode
                                                                        }
                                                                    </li>
                                                                </ul>
                                                            )}
                                                    </fieldset>
                                                    <fieldset className="form__fields form__fields--constrained hide-input-err">
                                                        <Textfield
                                                            id="contact-phone"
                                                            className={`pt-2`}
                                                            label="Phone Number (optional)"
                                                            type="tel"
                                                            placeholder="(XXX) XXX-XXXX"
                                                            name="authorizedRepresentative.phone"
                                                            value={formatPhoneNumber(
                                                                values?.authorizedRepresentative?.phone,
                                                                true
                                                            )}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={
                                                                errors?.authorizedRepresentative?.phone ? true : false
                                                            }
                                                        />
                                                        {(touched.authorizedRepresentative?.phone || submitCount > 0) &&
                                                            errors?.authorizedRepresentative?.phone && (
                                                                <ul className="details-edit-custom-error-msg">
                                                                    <li className="error-msg-red ">
                                                                        Phone Number must be a valid 10-digit phone
                                                                        number
                                                                    </li>
                                                                </ul>
                                                            )}
                                                        <Textfield
                                                            id="representative-relationship-to-beneficiary"
                                                            label="Relationship to Beneficiary *"
                                                            name="authorizedRepresentative.relationshipToBeneficiary"
                                                            value={
                                                                values?.authorizedRepresentative
                                                                    ?.relationshipToBeneficiary
                                                            }
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={
                                                                (touched.authorizedRepresentative
                                                                    ?.relationshipToBeneficiary ||
                                                                    submitCount > 0) &&
                                                                errors?.authorizedRepresentative
                                                                    ?.relationshipToBeneficiary
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {(touched.authorizedRepresentative?.relationshipToBeneficiary ||
                                                            submitCount > 0) &&
                                                            errors?.authorizedRepresentative?.relationshipToBeneficiary}
                                                    </fieldset>
                                                    <div className="authorized-representative-details">
                                                        <span className="heading">
                                                            Please fill out the following details as the Authorized
                                                            Representative:
                                                        </span>
                                                        <div className="understand-contents-of-soa">
                                                            <Checkbox
                                                                className="understand-contents-of-soa-checkbox"
                                                                name="acceptedSOA"
                                                                checked={values.acceptedSOA}
                                                                onChange={handleChange}
                                                            />
                                                            <div className="understand-contents-of-soa-content">
                                                                By checking this box, I have read and understand the
                                                                contents of the Scope of Appointment form, and that I
                                                                confirm that the information I have provided is
                                                                accurate. If submitted by an authorized individual (as
                                                                described above), this submission certifies that 1) this
                                                                person is authorized under State law to complete the
                                                                Scope of Appointment form, and 2) documentation of this
                                                                authority is available upon request by Medicare.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            )}
                                            <div className="submit-button">
                                                <Button
                                                    data-gtm="button-submit"
                                                    disabled={!dirty || !isValid}
                                                    fullWidth={true}
                                                    label="Submit"
                                                    onClick={() => {
                                                        setFieldValue("products", products);
                                                        handleSubmit();
                                                    }}
                                                />
                                            </div>
                                        </section>
                                    </Form>
                                </Card>
                            </Container>
                            <section ref={medicareOverviewSectionEl} className="medicare-overview">
                                <MedicareOverviewCard />
                            </section>
                        </div>
                    </>
                );
            }}
        </Formik>
    );
    return (
        <WithLoader isLoading={isLoading}>
            <Navigation />
            {soaStatus?.status === "Completed" || soaStatus?.status === "Need Agent Signature" ? (
                <FormAlreadySubmitted />
            ) : (
                confirmationForm
            )}
        </WithLoader>
    );
};

export default ScopeOfAppointmentConfirmation;
