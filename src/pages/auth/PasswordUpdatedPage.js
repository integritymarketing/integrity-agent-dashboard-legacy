import React from "react";
import { Helmet } from "react-helmet-async";

import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";

const PasswordUpdatePage = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>Integrity - Reset Password</title>
            </Helmet>
            <BaseConfirmationPage title="You’re all set" body="The password for your account has been updated." />
        </React.Fragment>
    );
};

export default PasswordUpdatePage;
