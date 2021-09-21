import React, { useState, useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Back from "components/icons/back";
import * as Sentry from "@sentry/react";
import BackNavContext from "contexts/backNavProvider";
import clientService from "services/clientsService";
import ReminderIcon from "stories/assets/reminder.svg";
import "./contactsSoa.scss";
import Datepicker from "../datepicker";

const FormInput = ({
  isSubmited,
  objKey,
  onChangeFormValue,
  formValues,
  ...props
}) => {
  const value = formValues[objKey];
  if (isSubmited) {
    return value || null;
  }
  const handleChange = (e) => {
    onChangeFormValue(objKey, e.target.value);
  };
  return (
    <input
      className="soa-form-input"
      {...props}
      value={value}
      onChange={handleChange}
    />
  );
};

const LabelValueItem = ({ label, value }) => {
  return (
    <div className="key-value-wrapper">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
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
  const history = useHistory();
  const { contactId, linkCode } = useParams();
  const { previousPage } = useContext(BackNavContext);
  const [soaConfirmData, setSoaConfirmData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [isSubmited, setIsSubmited] = useState(false);

  useEffect(() => {
    const getSoaByLinkCode = async () => {
      await clientService
        .getSoaByLinkCode(contactId, linkCode)
        .then((data) => {
          setSoaConfirmData(data);
        })
        .catch((e) => {
          Sentry.captureException(e);
        });
    };
    getSoaByLinkCode();
  }, [contactId, linkCode]);

  const isValid =
    formValues &&
    formValues.firstName &&
    formValues.lastName &&
    formValues.methodOfContact &&
    formValues.soaSignedDuringAppointment &&
    formValues.explanationOfSOASignedDuringAppointment &&
    formValues.acceptedSOA &&
    formValues.appointmentDate;
  const handleSubmit = async () => {
    const payload = {
      ...soaConfirmData,
      agentSection: formValues,
    };
    try {
      await clientService.saveSOAInformation(contactId, linkCode, payload);
    } catch (e) {
      Sentry.captureException(e);
    }
    setIsSubmited(true);
  };

  if (!soaConfirmData) {
    return null;
  }

  const {
    leadSection,
    hasAuthorizedRepresentative,
    acceptedSOA,
    submittedDateTime,
  } = soaConfirmData;

  const formProps = {
    isSubmited,
    formValues,
    onChangeFormValue(key, value) {
      setFormValues((prev) => ({ ...prev, [key]: value }));
    },
  };

  return (
    <div className="contacts-soa">
      <header className="global-nav-v2 gtm-nav-wrapper">
        <a
          className="page-title"
          href="#eslint"
          onClick={(e) => {
            e.preventDefault();
            history.goBack();
          }}
        >
          <Back /> Back to {previousPage}
        </a>
      </header>
      <div className="content-wrapper">
        <div className="heading">Scope of Appointment Confirmation Form</div>
        <div className="section-1">
          The Centers for Medicare and Medicaid Services requires agents to
          document the scope of a marketing appointment prior to any
          face-to-face sales meeting to ensure understanding of what will be
          discussed between the agent and the Medicare beneficiary (or their
          authorized representative). All information provided on this form is
          confidential and should be completed by each person with Medicare or
          his/her authorized representative.
        </div>
        <div className="section-2">
          <div className="title">
            Please check the types of product(s) you want to the agent to
            discuss.
          </div>
          {leadSection?.products?.map((product) => (
            <div className="item">{product}</div>
          ))}
        </div>
        <div className="section-1">
          By signing this form, you agree to a meeting with a sales agent to
          discuss the types of products you indicated above. Please note, the
          person who will discuss the products is either employed or contracted
          by a Medicare plan. They do not work directly for the federal
          government. This individual may also be paid based on your enrollment
          in a plan.
          <br />
          <br />
          Signing this form does NOT obligate you to enroll in a plan, affect
          your current enrollment, or enroll you in a Medicare plan.
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
                value={leadSection?.beneficiary?.initial}
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
              <LabelValueItem
                label="Address (Line 1)"
                value={leadSection?.beneficiary?.address}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Row>
                <Col>
                  <LabelValueItem
                    label="City"
                    value={leadSection?.beneficiary?.city}
                  />
                </Col>
                <Col>
                  <LabelValueItem
                    label="State"
                    value={leadSection?.beneficiary?.state}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <LabelValueItem
                label="ZIP"
                value={leadSection?.beneficiary?.zip}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <LabelValueItem
                label="Phone"
                value={leadSection?.beneficiary?.phone}
              />
            </Col>
          </Row>
          <Row>
            <Col fullWidth>
              <LabelValueItem
                label="Are you the authorized representative acting on behalf of the benificiary?"
                value={
                  <Col>
                    <div className="soa-authorize-container">
                      <input
                        type="radio"
                        checked={hasAuthorizedRepresentative}
                      />
                      Yes
                    </div>
                    <div className="soa-authorize-container">
                      <input
                        type="radio"
                        checked={!hasAuthorizedRepresentative}
                      />
                      No
                    </div>
                  </Col>
                }
              />
            </Col>
          </Row>
          <Row>
            <div className="soa-terms-conditions">
              <input type="checkbox" checked={acceptedSOA} />
            </div>
            <div>
              By checking this box, I have read and understand the contents of
              the Scope of Appointment form, and that I confirm that the
              information I have provided is accurate. If submitted by an
              authorized individual (as described above), this submission
              certifies that 1) this person is authorized under State law to
              complete the Scope of Appointment form, and 2) documentation of
              this authority is available upon request by Medicare.
            </div>
          </Row>
          <Row>
            <Col>
              <LabelValueItem
                label="Beneficiary Submitted"
                value={submittedDateTime}
              />
            </Col>
          </Row>
        </div>
        <div className="heading with-top-margin">
          Scope of Appointment Form (To be completed by Agent)
        </div>
        <div className="section-1">
          Scope of Appointment form needs to be completed and submitted for all
          scheduled appointments (even for no-shows, cancelled appointments, or
          those that do not result in a sale)
        </div>
        <div className="section-1">
          <Row>
            <LabelValueItem
              label="Agent First Name"
              value={<FormInput {...formProps} objKey="firstName" />}
            />
          </Row>
          <Row>
            <LabelValueItem
              label="Agent Last Name"
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
              label="Initial Method of Contact"
              value={<FormInput {...formProps} objKey="methodOfContact" />}
            />
          </Row>
          <Row>
            <LabelValueItem
              label="Was the Scope of Appointment signed at the time of the appointment?"
              value={
                <FormInput {...formProps} objKey="soaSignedDuringAppointment" />
              }
            />
          </Row>
          <Row>
            <LabelValueItem
              label="Provide an explanatiation why the SOA was not documented prior to the meeting:"
              value={
                isSubmited ? (
                  formValues.explanationOfSOASignedDuringAppointment
                ) : (
                  <textarea
                    value={formValues.explanationOfSOASignedDuringAppointment}
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
                        top: "5px",
                        left: "5px",
                        zIndex: 2,
                      }}
                      src={ReminderIcon}
                      alt=""
                      height="20"
                      className="mr-1"
                    />
                    <Datepicker
                      format="MM/dd/yy"
                      date={formValues.appointmentDate || new Date()}
                      onChangeDate={(date) => {
                        formProps.onChangeFormValue("appointmentDate", date);
                      }}
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
              By checking this box, I confirm the information represented here
              is true and accurate. I authorize my signature on the Scope of
              Appointment form using this information.
            </div>
          </Row>
          {!isSubmited && (
            <Row>
              <button
                className="btn-submit"
                disabled={!isValid}
                onClick={handleSubmit}
              >
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
