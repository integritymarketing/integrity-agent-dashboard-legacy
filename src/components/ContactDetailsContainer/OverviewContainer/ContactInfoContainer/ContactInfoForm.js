import React, { useEffect, useState } from 'react'
import SectionContainer from '../CommonComponents/SectionContainer'
import {
    StyledElementName, StyledFormItem, StyledGenderFormElements, StyledNumberInputContainer, StyledInputField,
    StyledButtonFormElement,
    StyledDatePicker
} from './StyledComponents'
import styles from './ContactInfoContainer.module.scss'
import { Select } from 'components/ui/Select'
import DatePickerMUI from 'components/DatePicker'
import { formatDate } from 'utils/dates'

const initialFormData = {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    primaryContact: '',
    email: '',
    homePhone: '',
    cellPhone: '',
    line1: '',
    line2: '',
    city: '',
    zipCode: '',
    state: '',
    country: '',
    medicareBeneficiaryID: '',
    partA: '',
    partB: '',
    medicaid: ''
}

function ContactInfoForm({ leadDetails }) {
    const [formData, setFormData] = useState(initialFormData)



    useEffect(() => {
        setFormData({
            firstName: leadDetails?.firstName,
            middleName: leadDetails?.middleName,
            lastName: leadDetails?.lastName,
            dateOfBirth: leadDetails?.leadBirthdate,
            primaryContact: leadDetails?.isPrimary,
            email: leadDetails?.leadEmail,
            homePhone: leadDetails?.leadPhone,
            cellPhone: leadDetails?.leadPhone,
            line1: leadDetails?.leadAddress1,
            line2: leadDetails?.leadAddress2,
            city: leadDetails?.leadCity,
            zipCode: leadDetails?.leadZip,
            state: leadDetails?.leadState,
            county: leadDetails?.leadCounty,
            medicareBeneficiaryID: leadDetails?.leadMBID,
            partA: leadDetails?.leadPartA,
            partB: leadDetails?.leadPartB,
            medicaid: leadDetails?.hasMedicAid ? "Yes" : "No"
        })
    }, [leadDetails])


    const onChangeFormData = (formElement, value) => {
        setFormData({
            ...formData,
            [formElement]: value,
        });
    };



    return <div>
        <SectionContainer>
            <StyledFormItem>
                <StyledElementName>
                    First Name
                </StyledElementName>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledInputField
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={({ target }) => {
                            onChangeFormData("firstName", target.value);
                        }}
                    />
                </StyledNumberInputContainer>
            </StyledFormItem>
            <StyledFormItem>
                <StyledElementName>
                    Middle Initial
                </StyledElementName>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledInputField
                        type="text"
                        placeholder="Middle Initial"
                        value={formData.middleName}
                        onChange={({ target }) => {
                            onChangeFormData("middleName", target.value);
                        }}
                    />
                </StyledNumberInputContainer>
            </StyledFormItem>
            <StyledFormItem>
                <StyledElementName>
                    Last Name
                </StyledElementName>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledInputField
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={({ target }) => {
                            onChangeFormData("lastName", target.value);
                        }}
                    />
                </StyledNumberInputContainer>
            </StyledFormItem>
        </SectionContainer>

        <SectionContainer>
            <StyledFormItem>
                <StyledElementName>
                    Birthdate
                </StyledElementName>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledDatePicker>
                        <DatePickerMUI
                            value={formData.dateOfBirth}
                            disableFuture={true}
                            onChange={(value) => {
                                onChangeFormData("dateOfBirth", formatDate(value));
                            }}
                            isMobile={true}
                        />
                    </StyledDatePicker>
                </StyledNumberInputContainer>
            </StyledFormItem>
        </SectionContainer>

        <SectionContainer>
            <StyledFormItem>
                <StyledElementName>
                    Primary Contact
                </StyledElementName>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <Select
                        // error={isInvalid("state")}
                        options={[]}
                        placeholder="Phone"
                        initialValue={formData.primaryContact}
                        onChange={(value) => {
                            onChangeFormData("primaryContact", value);
                        }}
                        showValueAlways={true}
                    />
                </StyledNumberInputContainer>
            </StyledFormItem>
        </SectionContainer>

        <SectionContainer>
            <StyledFormItem>
                <StyledElementName>
                    Email
                </StyledElementName>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledInputField
                        type="text"
                        placeholder="Email"
                        value={formData.email}
                        onChange={({ target }) => {
                            onChangeFormData("email", target.value);
                        }}
                    />
                </StyledNumberInputContainer>
            </StyledFormItem>
        </SectionContainer>

        <SectionContainer>
            <StyledFormItem>
                <StyledElementName>
                    Home Phone
                </StyledElementName>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledInputField
                        type="number"
                        placeholder="Phone number"
                        value={formData.homePhone}
                        onChange={({ target }) => {
                            onChangeFormData("homePhone", target.value);
                        }}
                    />
                </StyledNumberInputContainer>
            </StyledFormItem>
            <StyledFormItem>
                <StyledElementName>
                    Cell Phone
                </StyledElementName>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledInputField
                        type="number"
                        placeholder="Phone number"
                        value={formData.cellPhone}
                        onChange={({ target }) => {
                            onChangeFormData("cellPhone", target.value);
                        }}
                    />
                </StyledNumberInputContainer>
            </StyledFormItem>
        </SectionContainer>

        <SectionContainer>
            <StyledFormItem>
                <StyledElementName>
                    Address
                </StyledElementName>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledInputField
                        type="text"
                        placeholder="Address Line 1"
                        value={formData.line1}
                        onChange={({ target }) => {
                            onChangeFormData("line1", target.value);
                        }}
                    />
                </StyledNumberInputContainer>
            </StyledFormItem>
            <StyledFormItem>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledInputField
                        type="text"
                        placeholder="Enter Apt, Suite, Unit"
                        value={formData.line2}
                        onChange={({ target }) => {
                            onChangeFormData("line2", target.value);
                        }}
                    />
                </StyledNumberInputContainer>
            </StyledFormItem>
            <StyledFormItem>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledInputField
                        type="text"
                        placeholder="Enter City"
                        value={formData.city}
                        onChange={({ target }) => {
                            onChangeFormData("city", target.value);
                        }}
                    />
                </StyledNumberInputContainer>
            </StyledFormItem>
            <div className={styles.horizontalLayout}>
                <StyledFormItem>
                    <StyledNumberInputContainer style={{ width: "100%" }}>
                        <StyledInputField
                            type="number"
                            placeholder="Zip Code"
                            value={formData.zipCode}
                            onChange={({ target }) => {
                                onChangeFormData("zipCode", target.value);
                            }}
                        />
                    </StyledNumberInputContainer>
                </StyledFormItem>
                <StyledFormItem>
                    <StyledNumberInputContainer style={{ width: "100%" }}>
                        <StyledInputField
                            type="text"
                            placeholder="State"
                            value={formData.state}
                            onChange={({ target }) => {
                                onChangeFormData("state", target.value);
                            }}
                        />
                    </StyledNumberInputContainer>
                </StyledFormItem>
            </div>
            <StyledFormItem>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <Select
                        placeholder="Select County"
                        // error={isInvalid("state")}
                        options={[]}
                        initialValue={formData.country}
                        onChange={(value) => {
                            onChangeFormData("country", value);
                        }}
                        showValueAlways={true}
                    />
                </StyledNumberInputContainer>
            </StyledFormItem>
        </SectionContainer>

        <SectionContainer>
            <StyledFormItem>
                <StyledElementName>
                    Medicare Beneficiary ID
                </StyledElementName>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledInputField
                        type="text"
                        placeholder="XXXX-XXX-XXXX"
                        value={formData.medicareBeneficiaryID}
                        onChange={({ target }) => {
                            onChangeFormData("medicareBeneficiaryID", target.value);
                        }}
                    />
                </StyledNumberInputContainer>
            </StyledFormItem>
        </SectionContainer>


        <SectionContainer>
            <StyledFormItem>
                <StyledElementName>
                    Medicare Part A Effective Date
                </StyledElementName>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledDatePicker>
                        <DatePickerMUI
                            value={formData.partA}
                            disableFuture={true}
                            onChange={(value) => {
                                onChangeFormData("partA", formatDate(value));
                            }}
                            isMobile={true}
                        />
                    </StyledDatePicker>
                </StyledNumberInputContainer>
            </StyledFormItem>
        </SectionContainer>


        <SectionContainer>
            <StyledFormItem>
                <StyledElementName>
                    Medicare Part B Effective Date
                </StyledElementName>
                <StyledNumberInputContainer style={{ width: "100%" }}>
                    <StyledDatePicker>
                        <DatePickerMUI
                            value={formData.partB}
                            disableFuture={true}
                            onChange={(value) => {
                                onChangeFormData("partB", formatDate(value));
                            }}
                            isMobile={true}
                        />
                    </StyledDatePicker>
                </StyledNumberInputContainer>
            </StyledFormItem>
        </SectionContainer>

        <SectionContainer>
            <StyledFormItem>
                <StyledElementName>Medicaid</StyledElementName>
                <StyledGenderFormElements>
                    <StyledButtonFormElement
                        selected={formData.medicaid === "Yes"}
                        onClick={() => {
                            onChangeFormData("medicaid", "Yes");
                        }}
                    >
                        Yes
                    </StyledButtonFormElement>
                    <StyledButtonFormElement
                        selected={formData.medicaid === "No"}
                        onClick={() => {
                            onChangeFormData("medicaid", "No");
                        }}
                    >
                        No
                    </StyledButtonFormElement>
                </StyledGenderFormElements>
            </StyledFormItem>
        </SectionContainer>
    </div>
}

export default ContactInfoForm