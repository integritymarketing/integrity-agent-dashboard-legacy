import React, { useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./DuplicateContactNotificationBanner.module.css";
import Warning from "components/icons/warning";

export const DuplicateContactNotificationBanner = ({ duplicateLeadIds, duplicateLeadIdName }) => {
    const handleMultileDuplicates = useCallback(() => {
        if (duplicateLeadIds.length) {
            window.localStorage.setItem("duplicateLeadIds", JSON.stringify(duplicateLeadIds));
        }
        return true;
    }, [duplicateLeadIds]);

    const renderDuplicateLink = () => {
        if (duplicateLeadIds.length === 1) {
            return (
                <a href={`/contact/${duplicateLeadIds[0]}/overview`} target="_blank" rel="noopener noreferrer">
                    {duplicateLeadIdName || "this contact link."}
                </a>
            );
        } else if (duplicateLeadIds.length > 1) {
            return (
                <a onClick={handleMultileDuplicates} href="/contacts-list" target="_blank" rel="noopener noreferrer">
                    these contacts
                </a>
            );
        }
    };

    if (duplicateLeadIds.length > 0) {
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
