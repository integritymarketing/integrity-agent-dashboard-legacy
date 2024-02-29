import { useWindowSize } from "hooks/useWindowSize";

import AccountPage from "pages/AccountPage";
import { AccountPageMobile } from "pages/Account/AccountPageMobile";

import { AccountProductsProvider } from "./providers/AccountProductsProvider";

function Account() {
    const { width: windowWidth } = useWindowSize();

    const isMobile = windowWidth <= 784;

    return (
        <AccountProductsProvider>
            {isMobile && <AccountPageMobile />}
            {!isMobile && <AccountPage />}
        </AccountProductsProvider>
    );
}

export default Account;
