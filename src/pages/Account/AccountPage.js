import AccountPage from "pages/AccountPage";

import { AccountProductsProvider } from "./providers/AccountProductsProvider";

function Account() {
    return (
        <AccountProductsProvider>
            <AccountPage />
        </AccountProductsProvider>
    );
}

export default Account;
