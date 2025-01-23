import * as Sentry from "@sentry/react";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import dateFnsFormat from "date-fns/format";

import NavBarWithBack from "partials/back-nav";

import BackNavContext from "contexts/backNavProvider";

import { useClientServiceContext } from "services/clientServiceProvider";

import "./contactsSoa.scss";

const FormInput = ({ isSubmited, objKey, onChangeFormValue, formValues, ...props }) => {
    const value = formValues[objKey];

    if (isSubmited) {
        return value || null;
    }
    const handleChange = (e) => {
        onChangeFormValue(objKey, e.target.value);
    };
    return <input className="soa-form-input" {...props} value={value} onChange={handleChange} />;
};

const LabelValueItem = ({ label, value }) => {
    return (
        <div className="key-value-wrapper">
            <div className="label">{label}</div>
            <div className="value">{value || "--"}</div>
        </div>
    );
};

const Row = ({ children }) => {
    return <div className="row">{children}</div>;
};

const Col = ({ children, fullWidth = false }) => {
    return <div className={`col${fullWidth ? " full" : ""}`}>{children}</div>;
};

const ContactsSOAConfirmForm = () => {
    const { contactId, linkCode } = useParams();
    const { previousPage } = useContext(BackNavContext);
    const { state } = useLocation();
    const [soaConfirmData, setSoaConfirmData] = useState(null);
    const [formValues, setFormValues] = useState({
        appointmentDate: dateFnsFormat(new Date(), "MM/dd/yy"),
    });
    const [isSubmited, setIsSubmited] = useState(false);
    const { clientsService } = useClientServiceContext();

    useEffect(() => {
        getSoaByLinkCode();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contactId, linkCode]);

    const getSoaByLinkCode = async () => {
        await clientsService
            .getSoaByLinkCode(contactId, linkCode)
            .then((data) => {
                setSoaConfirmData(data);
                const agent_data = data?.agentSection;
                if (data?.status === "Completed") {
                    setFormData(agent_data);
                }
                if (data?.status === "Need Agent Signature") {
                    setFormValues({
                        ...formValues,
                        firstName: agent_data?.firstName,
                        lastName: agent_data?.lastName,
                        phoneNumber: agent_data?.phoneNumber,
                    });
                }
            })
            .catch((e) => {
                Sentry.captureException(e);
            });
    };
    const setFormData = (agent_data) => {
        setFormValues({
            acceptedSOA: agent_data.acceptedSOA,
            appointmentDate: agent_data.appointmentDate,
            explanationOfSOASignedDuringAppointment: agent_data.explanationOfSOASignedDuringAppointment,
            firstName: agent_data.firstName,
            lastName: agent_data.lastName,
            methodOfContact: agent_data.methodOfContact,
            phoneNumber: agent_data.phoneNumber,
            soaSignedDuringAppointment: agent_data.soaSignedDuringAppointment,
        });
        setIsSubmited(true);
    };

    const isValid =
        formValues &&
        formValues.firstName &&
        formValues.lastName &&
        formValues.methodOfContact &&
        formValues.acceptedSOA &&
        (formValues.soaSignedDuringAppointment ? formValues.explanationOfSOASignedDuringAppointment : true);
    const handleSubmit = async () => {
        formValues.submittedDateTime = new Date().toISOString();
        const payload = {
            ...soaConfirmData,
            agentSection: formValues,
        };
        try {
            const response = await clientsService.saveSOAInformation(linkCode, payload);
            if (response.ok) {
                getSoaByLinkCode();
            }
        } catch (e) {
            Sentry.captureException(e);
        }
    };

    if (!soaConfirmData) {
        return null;
    }

    const { leadSection, agentSection } = soaConfirmData;

    const benificiarySubmittedDateTime = leadSection?.submittedDateTime
        ? dateFnsFormat(new Date(leadSection?.submittedDateTime), "MM/dd/yy p")
        : "";

    const agentSubmittedDateTime = agentSection?.submittedDateTime
        ? dateFnsFormat(new Date(agentSection?.submittedDateTime), "MM/dd/yy p")
        : "";

    const formProps = {
        isSubmited,
        formValues,
        onChangeFormValue(key, value) {
            setFormValues((prev) => ({ ...prev, [key]: value }));
        },
    };

    return (
        <div className="contacts-soa">
            <NavBarWithBack title={`Back to ${state?.from || previousPage}`} leadId={contactId} />
            <div className="content-wrapper">
                <div className="heading">Scope of Appointment Confirmation Form</div>
                <div className="section-1">
                    The Centers for Medicare and Medicaid Services requires agents to document the scope of a marketing
                    appointment prior to any face-to-face sales meeting to ensure understanding of what will be
                    discussed between the agent and the Medicare beneficiary (or their authorized representative). All
                    information provided on this form is confidential and should be completed by each person with
                    Medicare or his/her authorized representative.
                </div>
                <div className="section-2">
                    <div className="title">Please check the types of product(s) you want to the agent to discuss.</div>
                    {leadSection?.products?.map((product) => (
                        <div className="item">{product}</div>
                    ))}
                </div>
                <div className="section-1">
                    By signing this form, you agree to a meeting with a sales agent to discuss the types of products you
                    indicated above. Please note, the person who will discuss the products is either employed or
                    contracted by a Medicare plan. They do not work directly for the federal government. This individual
                    may also be paid based on your enrollment in a plan.
                    <br />
                    <br />
                    Signing this form does NOT obligate you to enroll in a plan, affect your current enrollment, or
                    enroll you in a Medicare plan.
                </div>
                <div className="section-2">
                    <Row>
                        <Col>
                            <LabelValueItem
                                label="Beneficiary’s First Name"
                                value={leadSection?.beneficiary?.firstName}
                            />
                        </Col>

                        <Col>
                            <LabelValueItem
                                label="Beneficiary’s Middle Initial"
                                value={leadSection?.beneficiary?.middleName?.toUpperCase()}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <LabelValueItem
                                label="Beneficiary’s Last Name"
                                value={leadSection?.beneficiary?.lastName}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <LabelValueItem label="Address (Line 1)" value={leadSection?.beneficiary?.address1} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <LabelValueItem label="Address (Line 2)" value={leadSection?.beneficiary?.address2} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Row>
                                <Col>
                                    <LabelValueItem label="City" value={leadSection?.beneficiary?.city} />
                                </Col>
                                <Col>
                                    <LabelValueItem label="State" value={leadSection?.beneficiary?.state} />
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <LabelValueItem label="ZIP" value={leadSection?.beneficiary?.zip} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <LabelValueItem label="Phone" value={leadSection?.beneficiary?.phone} />
                        </Col>
                    </Row>
                    {leadSection?.hasAuthorizedRepresentative && (
                        <>
                            <Row>
                                <Col fullWidth>
                                    <LabelValueItem
                                        label="Are you the authorized representative acting on behalf of the benificiary?"
                                        value={
                                            <Col>
                                                <div className="soa-authorize-container">
                                                    <input
                                                        type="checkbox"
                                                        className="input-tag"
                                                        disabled
                                                        checked={leadSection?.hasAuthorizedRepresentative}
                                                    />
                                                    Yes
                                                </div>
                                            </Col>
                                        }
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <LabelValueItem
                                        label="Authorized Representative’s First Name"
                                        value={leadSection?.authorizedRepresentative?.firstName}
                                    />
                                </Col>

                                <Col>
                                    <LabelValueItem
                                        label="Authorized Representative’s Middle Initial"
                                        value={leadSection?.authorizedRepresentative?.middleName?.toUpperCase()}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <LabelValueItem
                                        label="Authorized Representative’s Last Name"
                                        value={leadSection?.authorizedRepresentative?.lastName}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <LabelValueItem
                                        label="Address (Line 1)"
                                        value={leadSection?.authorizedRepresentative?.address1}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <LabelValueItem
                                        label="Address (Line 2)"
                                        value={leadSection?.authorizedRepresentative?.address2}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            <LabelValueItem
                                                label="City"
                                                value={leadSection?.authorizedRepresentative?.city}
                                            />
                                        </Col>
                                        <Col>
                                            <LabelValueItem
                                                label="State"
                                                value={leadSection?.authorizedRepresentative?.state}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <LabelValueItem label="ZIP" value={leadSection?.authorizedRepresentative?.zip} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <LabelValueItem
                                        label="Phone"
                                        value={leadSection?.authorizedRepresentative?.phone}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <LabelValueItem
                                        label="Relationship To Beneficiary"
                                        value={leadSection?.authorizedRepresentative?.relationshipToBeneficiary}
                                    />
                                </Col>
                            </Row>
                        </>
                    )}
                    <Row>
                        <div className="soa-terms-conditions">
                            <input type="checkbox" disabled checked={leadSection?.acceptedSOA} />
                        </div>
                        <div>
                            By checking this box, I have read and understand the contents of the Scope of Appointment
                            form, and that I confirm that the information I have provided is accurate. If submitted by
                            an authorized individual (as described above), this submission certifies that 1) this person
                            is authorized under State law to complete the Scope of Appointment form, and 2)
                            documentation of this authority is available upon request by Medicare.
                        </div>
                    </Row>
                    <Row>
                        <Col>
                            <LabelValueItem label="Beneficiary Submitted" value={benificiarySubmittedDateTime} />
                        </Col>
                    </Row>
                </div>
                <div className="heading with-top-margin">
                    Scope of Appointment Form {!isSubmited && `(To be completed by Agent)`}
                </div>
                <div className="section-1">
                    Scope of Appointment form needs to be completed and submitted for all scheduled appointments (even
                    for no-shows, cancelled appointments, or those that do not result in a sale)
                </div>
                <div className="mandatory-notes">* Indicates a required field</div>
                <div className="section-1">
                    <Row>
                        <LabelValueItem
                            label="Agent First Name *"
                            value={<FormInput {...formProps} objKey="firstName" />}
                        />
                    </Row>
                    <Row>
                        <LabelValueItem
                            label="Agent Last Name *"
                            value={<FormInput {...formProps} objKey="lastName" />}
                        />
                    </Row>
                    <Row>
                        <LabelValueItem
                            label="Agent Phone (Optional)"
                            value={<FormInput {...formProps} objKey="phoneNumber" />}
                        />
                    </Row>
                    <Row>
                        <LabelValueItem
                            label="Initial Method of Contact *"
                            value={<FormInput {...formProps} objKey="methodOfContact" />}
                        />
                    </Row>
                    <Row>
                        <LabelValueItem
                            label="Was the Scope of Appointment signed at the time of the appointment?"
                            value={
                                <Col>
                                    <div className="soa-authorize-container">
                                        <input
                                            name="soaSignedDuringAppointment"
                                            className="input-tag"
                                            disabled={isSubmited}
                                            type="radio"
                                            onChange={() =>
                                                formProps.onChangeFormValue("soaSignedDuringAppointment", false)
                                            }
                                            checked={!formValues.soaSignedDuringAppointment}
                                        />
                                        No
                                    </div>
                                    <div className="soa-authorize-container">
                                        <input
                                            name="soaSignedDuringAppointment"
                                            className="input-tag"
                                            type="radio"
                                            disabled={isSubmited}
                                            onChange={() =>
                                                formProps.onChangeFormValue("soaSignedDuringAppointment", true)
                                            }
                                            checked={Boolean(formValues.soaSignedDuringAppointment)}
                                        />
                                        Yes
                                    </div>
                                </Col>
                            }
                        />
                    </Row>
                    {formValues.soaSignedDuringAppointment && (
                        <Row>
                            <LabelValueItem
                                label="Provide an explanation why the SOA was not documented prior to the meeting: *"
                                value={
                                    isSubmited ? (
                                        formValues.explanationOfSOASignedDuringAppointment
                                    ) : (
                                        <textarea
                                            value={formValues.explanationOfSOASignedDuringAppointment}
                                            className="soa-explanation"
                                            onChange={(e) =>
                                                formProps.onChangeFormValue(
                                                    "explanationOfSOASignedDuringAppointment",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    )
                                }
                            />
                            {}
                        </Row>
                    )}
                    <Row>
                        <LabelValueItem
                            label="Date Appointment Completed"
                            value={
                                isSubmited ? (
                                    formValues.appointmentDate
                                ) : (
                                    <div style={{ position: "relative" }}>
                                        <img
                                            style={{
                                                position: "absolute",
                                                top: "6px",
                                                left: "5px",
                                                zIndex: 2,
                                            }}
                                            alt=""
                                            height="17"
                                            className="mr-1"
                                        />
                                    </div>
                                )
                            }
                        />
                    </Row>
                    <Row>
                        <div className="soa-terms-conditions">
                            <input
                                type="checkbox"
                                disabled={isSubmited}
                                checked={formValues.acceptedSOA}
                                onChange={(e) => {
                                    formProps.onChangeFormValue("acceptedSOA", e.target.checked);
                                }}
                            />
                        </div>
                        <div>
                            By checking this box, I confirm the information represented here is true and accurate. I
                            authorize my signature on the Scope of Appointment form using this information.
                        </div>
                    </Row>
                    {isSubmited && (
                        <Row>
                            <Col>
                                <LabelValueItem label="Agent Submitted" value={agentSubmittedDateTime} />
                            </Col>
                        </Row>
                    )}
                    {isSubmited && linkCode && (
                        <Row>
                            <Col>
                                <LabelValueItem label="Confirmation number" value={linkCode} />
                            </Col>
                        </Row>
                    )}
                    {!isSubmited && (
                        <Row>
                            <button className="btn-submit" disabled={!isValid} onClick={handleSubmit}>
                                Submit
                            </button>
                        </Row>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactsSOAConfirmForm;
