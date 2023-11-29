export const getTransformedCounties = (counties) => {
    return counties.map((_county) => ({
        value: _county.countyName,
        label: _county.countyName,
        key: _county.countyFIPS,
        state: _county.state
    }));
};

export const getPayloadForUpdate = (contact, county, fips, state, zip) => {
    let addresses = [];
    if (contact.addresses.length !== 0 && contact.addresses?.[0].leadAddressId) {
        addresses = [
            {
                leadAddressId: contact.addresses?.[0].leadAddressId,
                address1: contact.addresses?.[0].address1,
                address2: contact.addresses?.[0].address2,
                city: contact.addresses?.[0].city,
                stateCode: state ? state : contact.addresses?.[0].stateCode,
                postalCode: zip ? zip : contact.addresses?.[0].postalCode,
                county: county,
                countyFips: fips,
                createDate: contact.addresses?.[0].createDate,
                modifyDate: contact.addresses?.[0].modifyDate,
            },
        ];
    } else {
        addresses = [
            {
                leadAddressId: null,
                address1: null,
                address2: null,
                city: null,
                stateCode: state ? state : contact.addresses?.[0].stateCode,
                postalCode: zip ? zip : contact.addresses?.[0].postalCode,
                county: county,
                countyFips: fips,
                createDate: null,
                modifyDate: null,
            },
        ];
    }

    const payload =
    {
        leadsId: contact.leadsId,
        firstName: contact.firstName,
        lastName: contact.lastName,
        birthdate: contact.birthdate,
        leadStatusId: contact.leadStatusId,
        primaryCommunication: contact.primaryCommunication,
        contactRecordType: contact.contactRecordType,
        notes: contact.notes,
        emails: contact.emails,
        phones: contact.phones,
        medicareBeneficiaryID: contact.medicareBeneficiaryID,
        partA: contact.partA,
        partB: contact.partB,
        addresses: [
            {
                leadAddressId: addresses?.[0]?.leadAddressId,
                address1: addresses?.[0]?.address1,
                address2: addresses?.[0]?.address2,
                city: addresses?.[0]?.city,
                stateCode: addresses?.[0]?.stateCode,
                postalCode: addresses?.[0]?.postalCode,
                county: addresses?.[0]?.county,
                countyFips: addresses?.[0]?.countyFips,
                createDate: addresses?.[0]?.createDate,
                modifyDate: addresses?.[0]?.modifyDate,
            },
        ],
    }
    return payload;
}