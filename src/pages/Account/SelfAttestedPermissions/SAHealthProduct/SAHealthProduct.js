import ErrorModal from "./SAPermissionModal/ErrorModal";
import SAExpiredModal from "./SAPermissionModal/ExpiredModal";

import { SAPermissionsTable } from "./SAPermissionsTable";
import { SAHealthProductProvider } from "./providers/SAHealthProductProvider";
import { SAPModalProvider } from "./providers/SAPModalProvider";

function SAHealthProduct() {
    return (
        <SAPModalProvider>
            <SAHealthProductProvider>
                <SAPermissionsTable />
            </SAHealthProductProvider>
            <SAExpiredModal />
            <ErrorModal />
        </SAPModalProvider>
    );
}

export default SAHealthProduct;
