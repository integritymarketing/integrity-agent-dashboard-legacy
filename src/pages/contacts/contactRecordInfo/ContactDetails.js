import React, { useState } from "react";
import { formatPhoneNumber } from "utils/phones";
import { formatDate } from "utils/dates";
import Editicon from "components/icons/edit-details";
import ContactSectionCard from "packages/ContactSectionCard";
import PasswordRevealIcon from "components/icons/password-reveal";
import PasswordHideIcon from "components/icons/password-hide";
import { formatMBID } from "utils/shared-utils/sharedUtility";

const NOT_AVAILABLE = "-";

const ContactDetails = ({ setDisplay, personalInfo, ...rest }) => {
    let {
        firstName = "",
        middleName = "",
        lastName = "",
        birthdate,
        emails = [],
        phones = [],
        addresses = [],
        contactPreferences,
        contactRecordType = "prospect",
        medicareBeneficiaryID,
        partA,
        partB,
    } = personalInfo;
    const [showMBID, setShowMBID] = useState(false);

    emails = emails?.length > 0 ? emails[0]?.leadEmail : NOT_AVAILABLE;
    const phoneData = phones.length > 0 ? phones[0] : null;
    const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";
    const phoneLabel = phoneData && phoneData.phoneLabel ? phoneData.phoneLabel : "Mobile";

    const addressData = addresses.length > 0 ? addresses?.[0] : null;
    const city = addressData && addressData.city ? addressData.city : "";
    const stateCode = addressData && addressData.stateCode ? addressData.stateCode : "";

    const address1 = addressData && addressData.address1 ? addressData.address1 : "";
    const address2 = addressData && addressData.address2 ? addressData.address2 : "";
    const postalCode = addressData && addressData.postalCode ? addressData.postalCode : "";

    const county = addressData && addressData.county ? addressData.county : NOT_AVAILABLE;

    const isPrimary = contactPreferences?.primary ? contactPreferences?.primary : "phone";

    return (
        <ContactSectionCard
            title={"Contact Details"}
            className={"enrollmentPlanContainer_detailsPage"}
            actions={
                !rest.isEdit && (
                    <div className={"iconWithTitle"} onClick={() => rest.setEdit(true)}>
                        <div className={"editIcon"}>
                            <Editicon />
                        </div>
                        <h3 className={"editText"}>Edit</h3>
                    </div>
                )
            }
        >
            <div className="contactdetailscardbody">
                <div className="contactDetailsSection">
                    <div className="contact-details-row mobile-responsive-row">
                        <div className="contact-details-col1">
                            <p className="contact-details-label">First Name</p>
                            <span className="contact-details-name">{firstName || NOT_AVAILABLE}</span>
                        </div>
                        <div className="custom-w-25 contact-details-col1">
                            <p className="contact-details-label">Middle Initial</p>
                            <span className="contact-details-name">{middleName || NOT_AVAILABLE}</span>
                        </div>
                        <div className="custom-w-25 contact-details-col1 mob-res-margin">
                            <p className="contact-details-label">Last Name</p>
                            <span className="contact-details-name">{lastName || NOT_AVAILABLE}</span>
                        </div>

                        <div className="responsive-display contact-details-col1">
                            <p className="contact-details-label">Date of Birth</p>
                            <span className="mob-mb-24 contact-details-name">
                                {birthdate ? formatDate(birthdate) : NOT_AVAILABLE}
                            </span>
                        </div>
                    </div>
                    <div className=" custom-mob-address-row contact-details-row">
                        <div className="responsive-d-none contact-details-col1">
                            <p className="contact-details-label">Date of Birth</p>
                            <span className="mob-mb-24 contact-details-name">
                                {birthdate ? formatDate(birthdate) : NOT_AVAILABLE}
                            </span>
                        </div>
                    </div>
                    <div className="custom-mob-email-row contact-details-row">
                        <div className="contact-details-col1">
                            <p className="contact-details-label ">E-Mail</p>
                            <span className="contact-details-name">{emails}</span>
                            {isPrimary === "email" && (
                                <span className="primary-communication-label">Primary Communication</span>
                            )}
                        </div>
                        <div className="responsive-inline">
                            <div className="w-50 custom-w-25 contact-details-col1">
                                <p className="contact-details-label">Phone Number</p>
                                <span className="contact-details-name">
                                    {phones ? formatPhoneNumber(phone) : NOT_AVAILABLE}
                                </span>
                                {isPrimary === "phone" && (
                                    <span className="primary-communication-label">Primary Communication</span>
                                )}
                            </div>
                            <div className="custom-w-43 custom-w-25 contact-details-col1">
                                <p className="contact-details-label">Label</p>
                                <span className="mob-mb-24 contact-details-name text-capitalize">{phoneLabel}</span>
                            </div>
                        </div>
                    </div>

                    <div className="custom-mob-address-row contact-details-row">
                        <div className="contact-details-col1">
                            <p className="contact-details-label">Address</p>
                            <span className="mob-mb-24 contact-details-name">{address1 || NOT_AVAILABLE}</span>
                        </div>
                        <div className="custom-w-59 custom-w-25 contact-details-col1">
                            <p className="contact-details-label">Address2</p>
                            <span className="contact-details-name">{address2 || NOT_AVAILABLE}</span>
                        </div>
                    </div>
                    <div className="contact-details-row mobile-responsive-row">
                        <div className="custom-w-53 contact-details-col1">
                            <p className="contact-details-label">City</p>
                            <span className="contact-details-name">{city || NOT_AVAILABLE}</span>
                        </div>
                        <div className="custom-w-22 custom-w-25 contact-details-col1">
                            <p className="contact-details-label">ZIP</p>
                            <span className="contact-details-name">{postalCode || NOT_AVAILABLE}</span>
                        </div>
                        <div className="custom-w-20 custom-w-25 contact-details-col1 mob-res-margin">
                            <p className="contact-details-label">State</p>
                            <span className="contact-details-name">{stateCode || NOT_AVAILABLE}</span>
                        </div>
                        <div className="custom-w-31 custom-w-25 contact-details-col1 mob-res-margin">
                            <p className="contact-details-label">County</p>
                            <span className="contact-details-name">{county}</span>
                        </div>
                    </div>
                    <div className="contact-details-row mobile-responsive-row">
                        <div className="contact-details-col1">
                            <p className="contact-details-label">Medicare Beneficiary ID Number</p>
                            {medicareBeneficiaryID ? (
                                <span className="contact-details-name">
                                    {formatMBID(medicareBeneficiaryID, showMBID) || NOT_AVAILABLE}
                                    <p onClick={() => setShowMBID((prev) => !prev)} className="mbidShowHide">
                                        {showMBID ? (
                                            <>
                                                <PasswordRevealIcon className="mbi__icon" />
                                                Hide Id
                                            </>
                                        ) : (
                                            <>
                                                <PasswordHideIcon className="mbi__icon" />
                                                Show Id
                                            </>
                                        )}
                                    </p>
                                </span>
                            ) : (
                                NOT_AVAILABLE
                            )}
                        </div>
                        <div className="custom-w-25 contact-details-col1">
                            <p className="contact-details-label">Part A Effective Date</p>
                            <span className="contact-details-name">{partA ? formatDate(partA) : NOT_AVAILABLE}</span>
                        </div>
                        <div className="custom-w-25 contact-details-col1 mob-res-margin">
                            <p className="contact-details-label">Part B Effective Date</p>
                            <span className="contact-details-name">{partB ? formatDate(partB) : NOT_AVAILABLE}</span>
                        </div>
                    </div>
                </div>
            </div>
        </ContactSectionCard>
    );
};

export default ContactDetails;
