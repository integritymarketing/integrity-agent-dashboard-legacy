import React, { useMemo } from 'react'
import Label from '../CommonComponents/Label'
import SectionContainer from '../CommonComponents/SectionContainer'
import styles from './ContactInfoContainer.module.scss'
import { Favorite } from '../Icons'
import { useLeadDetails } from "providers/ContactDetails";
import { formatPhoneNumber } from "utils/phones";
import { formatDate } from "utils/dates";
import { formatMBID } from "utils/shared-utils/sharedUtility";


const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
        age--;
    return age;
}


const NOT_AVAILABLE = "-";
export const ContactInfoContainer = () => {
    const { leadDetails, } = useLeadDetails();

    let {
        firstName = "",
        middleName = "",
        lastName = "",
        birthdate,
        emails = [],
        phones = [],
        addresses = [],
        contactPreferences,
        medicareBeneficiaryID,
        partA,
        partB,
    } = leadDetails;

    let phonesData = phones?.filter((phone) => {
        return phone?.leadPhone && phone?.leadPhone !== "" ? phone : null;
    });

    const leadName = useMemo(() => {
        return `${firstName} ${middleName && middleName} ${lastName}`
    }, [leadDetails]);


    const leadPhone = useMemo(() => {
        return phonesData?.[0]?.leadPhone ? formatPhoneNumber(phonesData?.[0]?.leadPhone) : NOT_AVAILABLE;
    }, [phonesData]);

    const leadEmail = useMemo(() => {
        return emails?.length > 0 ? emails?.[0]?.leadEmail : NOT_AVAILABLE;
    }, [emails]);

    const leadAddress = useMemo(() => {
        return addresses?.length > 0 ? addresses?.[0]?.address1 : NOT_AVAILABLE;
    }, [addresses]);

    const leadCity = useMemo(() => {
        return addresses?.length > 0 ? addresses?.[0]?.city : NOT_AVAILABLE;
    }, [addresses]);

    const leadState = useMemo(() => {
        return addresses?.length > 0 ? addresses?.[0]?.stateCode : NOT_AVAILABLE;
    }, [addresses]);

    const leadZip = useMemo(() => {
        return addresses?.length > 0 ? addresses?.[0]?.postalCode : NOT_AVAILABLE;
    }, [addresses]);

    const leadMBID = useMemo(() => {
        return medicareBeneficiaryID ? formatMBID(medicareBeneficiaryID) : NOT_AVAILABLE;
    }, [medicareBeneficiaryID]);

    const leadPartA = useMemo(() => {
        return partA ? formatDate(partA, "MM/dd/yyyy") : NOT_AVAILABLE;
    }, [partA]);

    const leadPartB = useMemo(() => {
        return partB ? formatDate(partB, "MM/dd/yyyy") : NOT_AVAILABLE;
    }, [partB]);

    const leadAge = useMemo(() => {
        return birthdate ? calculateAge(birthdate) : NOT_AVAILABLE;
    }, [birthdate]);

    const leadBirthdate = useMemo(() => {
        return birthdate ? formatDate(birthdate, "MM/dd/yyyy") : NOT_AVAILABLE;
    }, [birthdate]);

    const leadCounty = useMemo(() => {
        return addresses?.length > 0 ? addresses?.[0]?.county : NOT_AVAILABLE;
    }, [addresses]);

    const isPrimary = useMemo(() => {
        return contactPreferences?.primary ? contactPreferences?.primary : "phone";
    }, [contactPreferences]);


    return <div>
        <Label value="Contact Details" />
        <SectionContainer>
            <Label value="Full Name" color="#717171" size="14px" />
            <Label value={leadName} color="#052A63" size="20px" />
        </SectionContainer>
        <div className={styles.miniContainer}>
            <SectionContainer>
                <Label value="Birthdate" color="#717171" size="14px" />
                <Label value={leadBirthdate} color="#052A63" size="20px" />
            </SectionContainer>
            <SectionContainer>
                <Label value="Age" color="#717171" size="14px" />
                <Label value={leadAge} color="#052A63" size="20px" />
            </SectionContainer>
        </div>
        <SectionContainer>
            <Label value="Email" color="#717171" size="14px" />
            <div className={styles.horizontalLayout}>
                <Label value={leadEmail} color="#4178FF" size="16px" />

                {isPrimary === "email" && <Favorite />}
            </div>
        </SectionContainer>
        <SectionContainer >
            <Label value="Phone" color="#717171" size="14px" />
            <div className={`${styles.horizontalLayout}   ${styles.gap}`} >
                <div className={styles.horizontalLayout}>
                    <Label value="Home:" color="#052A63" size="16px" />
                    <Label value={leadPhone} color="#4178FF" size="16px" />
                </div>
                {isPrimary === "phone" && <Favorite />}
            </div>
            {/* ${styles.border}  Add this on main div, when using below element*/}
            {/* <div className={styles.horizontalLayout}>
                <Label value="Cell:" color="#052A63" size="16px" />
                <Label value="702-555-8546" color="#4178FF" size="16px" />
            </div> */}
        </SectionContainer>

        <SectionContainer >
            <Label value="Address" color="#717171" size="14px" />
            <Label value={leadAddress} color="#4178FF" size="16px" />
            <Label value={`${leadCity} ${leadState} ${leadZip}`} color="#4178FF" size="16px" />
            <div className={styles.horizontalLayout}>
                <Label value="County:" color="#052A63" size="16px" />
                <Label value={leadCounty} color="#717171" size="16px" />
            </div>
        </SectionContainer>

        <SectionContainer >
            <Label value="Medicare Beneficiary Identifier (MBIs)" color="#717171" size="14px" />
            <Label value={leadMBID} color="#052A63" size="16px" />
            <div className={`${styles.horizontalLayout} ${styles.gap}`} >
                <div>
                    <Label value="Part A start date" color="#717171" size="14px" />
                    <Label value={leadPartA} color="#052A63" size="16px" />
                </div>
                <div>
                    <Label value="Part B start date" color="#717171" size="14px" />
                    <Label value={leadPartB} color="#052A63" size="16px" />
                </div>
            </div>
        </SectionContainer>

        <SectionContainer >
            <Label value="Medicaid" color="#717171" size="14px" />
            <Label value="No" color="#052A63" size="16px" />
        </SectionContainer>

    </div>
}

