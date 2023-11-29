import AccountPage from "pages/AccountPage";

import { AgentAccountProvider } from "./providers/AgentAccountProvider";

function Account() {
    return (
        <AgentAccountProvider>
            <AccountPage />
        </AgentAccountProvider>
    );
}

export default Account;
