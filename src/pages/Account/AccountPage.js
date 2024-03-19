import useDeviceType from "hooks/useDeviceType";

import AccountPage from "pages/AccountPage";
import { AccountPageMobile } from "pages/Account/AccountPageMobile";

import { AccountProductsProvider } from "./providers/AccountProductsProvider";

function Account() {
    const { isMobile } = useDeviceType();

    return (
        <AccountProductsProvider>
            {isMobile && <AccountPageMobile />}
            {!isMobile && <AccountPage />}
        </AccountProductsProvider>
    );
}

export default Account;
