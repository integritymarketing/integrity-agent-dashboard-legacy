import { APHealthTable } from "./APHealthTable";

import { APHealthProvider } from "../providers/APHealthProvider";

function ActivePermissionsHealth() {
    return (
        <APHealthProvider>
            <APHealthTable />
        </APHealthProvider>
    );
}

export default ActivePermissionsHealth;
