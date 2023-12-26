import { useWindowSize } from "hooks/useWindowSize";

import { SAAddPermissionRow } from "./SAAddPermissionRow";
import ErrorModal from "./SAPermissionModal/ErrorModal";
import SAExpiredModal from "./SAPermissionModal/ExpiredModal";
import { SAPermissionsList } from "./SAPermissionsList";
import { SAPermissionsTable } from "./SAPermissionsTable";
import { SAHealthProductProvider } from "./providers/SAHealthProductProvider";
import { SAPModalProvider } from "./providers/SAPModalProvider";

function SAHealthProduct() {
    const { width: windowWidth } = useWindowSize();

    const isMobile = windowWidth <= 784;

    return (
        <SAPModalProvider>
            <SAHealthProductProvider>
                {!isMobile && <SAPermissionsTable />}
                {isMobile && <SAPermissionsList />}
                <SAAddPermissionRow />
            </SAHealthProductProvider>
            <SAExpiredModal />
            <ErrorModal />
        </SAPModalProvider>
    );
}

export default SAHealthProduct;
