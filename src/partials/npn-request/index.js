import React, { Fragment } from 'react';
import MailIcon from "components/icons/v2-mail";
import PhoneIcon from "components/icons/v2-phone";

export default function RequestNPN({ className = "", testId, ...props }) {
    return (
        <Fragment>
            <h2 id="dialog_help_label" className="hdg hdg--2 mb-1">
                {'Request an NPN'}
            </h2>
            <p id="dialog_help_desc" className="text-body mb-4">
                {'Contact support to request getting an NPN.'}
            </p>
            <p className="text-body mb-2" data-testid={`${testId}-phone`}>
                <PhoneIcon className="mr-1" />
                <a href="tel:+1-888-818-3760" className="link">
                    888-818-3760
                </a>
            </p>
            <p className="text-body mb-2" data-testid={`${testId}-email`}>
                <MailIcon className="mr-1" />
                <a href="mailto:support@medicarecenter.com" className="link">
                    support@medicarecenter.com
                </a>
            </p>
        </Fragment>
    )
}
