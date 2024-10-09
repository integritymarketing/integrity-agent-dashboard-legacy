import React, { useCallback , useEffect } from "react";


import PropTypes from "prop-types";
import { useDuplicateContacts, useLeadDetails } from "providers/ContactDetails";
import useFilteredLeadIds from "pages/ContactsList/hooks/useFilteredLeadIds";

import { toTitleCase } from "utils/toTitleCase";

import Warning from "components/icons/warning";

import styles from "./DuplicateContactNotificationBanner.module.scss";

export const DuplicateContactNotificationBanner = () => {
    const { leadDetails } = useLeadDetails();

    const { getDuplicateContacts, duplicateLeadIds, duplicateLeadIdName } = useDuplicateContacts();
    const { setFilteredDataHandle } = useFilteredLeadIds();

    useEffect(() => {
        if (leadDetails?.leadsId) {
            const { firstName, lastName, leadsId, emails, phones } = leadDetails;
            const email = emails?.[0]?.leadEmail ?? "";
            const leadPhone = phones?.[0]?.leadPhone ?? "";
            const leadPhoneLabel = phones?.[0]?.phoneLabel ?? "";
            const phone = { leadPhone, leadPhoneLabel };

            const payload = {
                firstName,
                lastName,
                phones: phone,
                email,
                leadId: leadsId,
            };
            getDuplicateContacts(payload);
        }
    }, [leadDetails, getDuplicateContacts]);

    const handleMultipleDuplicates = useCallback(() => {
        if (duplicateLeadIds?.length) {
            setFilteredDataHandle("duplicateLeadIds", null, duplicateLeadIds, null);
        }
        return true;
    }, [duplicateLeadIds]);

    const renderDuplicateLink = () => {
        if (duplicateLeadIds.length === 1) {
            return (
                <a href={`/contact/${duplicateLeadIds[0]}/overview`} target="_blank" rel="noopener noreferrer">
                    {duplicateLeadIdName ? toTitleCase(duplicateLeadIdName) : "this contact link."}
                </a>
            );
        } else if (duplicateLeadIds.length > 1) {
            return (
                <a onClick={handleMultipleDuplicates} href="/contacts" target="_blank" rel="noopener noreferrer">
                    these contacts
                </a>
            );
        }
    };

    if (duplicateLeadIds?.length > 0) {
        return (
            <section className={styles.duplicateContactLink}>
                <Warning />
                <span className={styles.duplicateText}>
                    The entry is a potential duplicate to&nbsp;&nbsp;{renderDuplicateLink()}
                </span>
            </section>
        );
    }

    return null;
};

DuplicateContactNotificationBanner.propTypes = {
    duplicateLeadIds: PropTypes.arrayOf(PropTypes.string),
    duplicateLeadIdName: PropTypes.string,
};
