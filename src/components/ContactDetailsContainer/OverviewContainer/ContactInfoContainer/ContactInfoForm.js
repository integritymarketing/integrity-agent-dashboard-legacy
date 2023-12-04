import React, { useEffect, useState, useCallback, useContext } from 'react'
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
import { primaryContactOptions } from 'utils/primaryContact'
import CountyContext from "contexts/counties";
import Label from "../CommonComponents/Label";
import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";
import { ArrowForwardWithCircle } from "../Icons";

const initialFormData = {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    primaryContact: '',
    email: '',
    leadPhone: '',
    cellPhone: '',
    address1: '',
    address2: '',
    city: '',
    zipCode: '',
    state: '',
    county: '',
    countyFips: '',
    medicareBeneficiaryID: '',
    partA: '',
    partB: '',
    medicaid: ''
}



function ContactInfoForm({ leadDetails, editLeadDetails, setIsEditMode }) {
    const [formData, setFormData] = useState(initialFormData);

    let {
        allCounties = [],
        allStates = [],
        fetchCountyAndState,
    } = useContext(CountyContext);


    useEffect(() => {
        setFormData({
            firstName: leadDetails?.firstName,
            middleName: leadDetails?.middleName,
            lastName: leadDetails?.lastName,
            dateOfBirth: leadDetails?.leadBirthdate,
            primaryContact: leadDetails?.contactPreferences?.primary
                ? leadDetails?.contactPreferences?.primary
                : "email",
            email: leadDetails?.leadEmail,
            leadPhone: leadDetails?.leadPhone,
            cellPhone: leadDetails?.leadPhone,
            address1: leadDetails?.leadAddress1,
            address2: leadDetails?.leadAddress2,
            city: leadDetails?.leadCity,
            zipCode: leadDetails?.leadZip,
            state: leadDetails?.leadState,
            county: leadDetails?.leadCounty,
            countyFips: leadDetails?.leadCountyFips,
            medicareBeneficiaryID: leadDetails?.leadMBID,
            partA: leadDetails?.leadPartA,
            partB: leadDetails?.leadPartB,
            medicaid: leadDetails?.hasMedicAid ? "Yes" : "No"
        })
    }, [leadDetails])



    useEffect(() => {
        if (allCounties?.length === 1) {
            let countyName = allCounties[0]?.value;
            let countyFipsName = allCounties[0]?.key;
            setFormData({
                ...formData,
                county: countyName,
                countyFips: countyFipsName,
            })
        }
        if (allStates?.length === 1) {
            let stateCodeName = allStates[0]?.value;
            setFormData({
                ...formData,
                state: stateCodeName,
            })
        }
    }, [allCounties, allStates]);



    const onChangeFormData = (formElement, value) => {
        setFormData({
            ...formData,
            [formElement]: value,
        });
    };


    useEffect(() => {
        if (formData.zipCode.length === 5) {
            fetchCountyAndState(formData.zipCode);
        }
    }, [formData.zipCode, fetchCountyAndState]);



    const handleSave = () => {
        const payload = {
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            birthdate: formData.dateOfBirth ? formatDate(formData.dateOfBirth) : "",
            primaryCommunication: formData.primaryContact,
            email: formData.email,
            phones: {
                leadPhone: formData.leadPhone,
                phoneLabel: "home",
            },
            address: {
                address1: formData.address1,
                address2: formData.address2,
                city: formData.city,
                stateCode: formData.state,
                postalCode: formData.zipCode,
                county: formData.county,
                countyFips: formData.countyFips,
            },
            medicareBeneficiaryID: formData.medicareBeneficiaryID,
            partA: formData.partA,
            partB: formData.partB,
            medicaid: formData.medicaid === "Yes" ? true : false,
            leadsId: leadDetails?.leadsId,
            leadAddressId: leadDetails?.leadAddressId,
            phoneId: leadDetails?.phoneId,
            leadStatusId: leadDetails?.leadStatusId,
            notes: leadDetails?.notes,
        };

        editLeadDetails(payload)
    }


    return (
        <Box>

            <div>
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
                                options={primaryContactOptions}
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
                            Phone
                        </StyledElementName>
                        <StyledNumberInputContainer style={{ width: "100%" }}>
                            <StyledInputField
                                type="number"
                                placeholder="Phone number"
                                value={formData.leadPhone}
                                onChange={({ target }) => {
                                    onChangeFormData("leadPhone", target.value);
                                }}
                            />
                        </StyledNumberInputContainer>
                    </StyledFormItem>
                    {/* <StyledFormItem>
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
            </StyledFormItem> */}
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
                                value={formData.address1}
                                onChange={({ target }) => {
                                    onChangeFormData("address1", target.value);
                                }}
                            />
                        </StyledNumberInputContainer>
                    </StyledFormItem>
                    <StyledFormItem>
                        <StyledNumberInputContainer style={{ width: "100%" }}>
                            <StyledInputField
                                type="text"
                                placeholder="Enter Apt, Suite, Unit"
                                value={formData.address2}
                                onChange={({ target }) => {
                                    onChangeFormData("address2", target.value);
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
                                        fetchCountyAndState(target.value);
                                        onChangeFormData("zipCode", target.value);
                                    }}
                                />
                            </StyledNumberInputContainer>
                        </StyledFormItem>
                        <StyledFormItem>
                            <StyledNumberInputContainer style={{ width: "100%" }}>
                                <Select
                                    placeholder="Select State"
                                    // error={isInvalid("state")}
                                    options={allStates}
                                    initialValue={formData.state}
                                    onChange={(value) => {
                                        onChangeFormData("state", value);
                                    }}
                                    showValueAlways={true}
                                    showValueAsLabel={true}

                                />
                            </StyledNumberInputContainer>
                        </StyledFormItem>
                    </div>
                    <StyledFormItem>
                        <StyledNumberInputContainer style={{ width: "100%" }}>
                            <Select
                                placeholder="Select County"
                                // error={isInvalid("state")}
                                options={allCounties}
                                initialValue={formData.county}
                                onChange={(value) => {
                                    onChangeFormData("county", value);
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

            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
            }}>
                <Label value={`Created Date: ${leadDetails?.leadCreatedDate}`} color="#717171" size="14px" />

            </Box>
            <Box className={styles.buttonContainer} >

                <Button
                    label={"Cancel"}
                    className={styles.deleteButton}
                    type="tertiary"
                    onClick={() => setIsEditMode(false)}
                />
                <Button
                    label={"Save"}
                    className={styles.editButton}
                    onClick={handleSave}
                    type="tertiary"
                    icon={<ArrowForwardWithCircle />}
                    iconPosition="right"
                />
            </Box>



        </Box>
    )
}

export default ContactInfoForm