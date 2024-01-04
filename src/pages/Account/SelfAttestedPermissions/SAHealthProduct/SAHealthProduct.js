import useRoles from "hooks/useRoles";
import { useWindowSize } from "hooks/useWindowSize";

import { NonRTSModal } from "packages/NonRTS-Modal";

import { InforBanner } from "pages/Account/InforBanner";

import { SAAddPermissionRow } from "./SAAddPermissionRow";
import ErrorModal from "./SAPermissionModal/ErrorModal";
import SAExpiredModal from "./SAPermissionModal/ExpiredModal";
import { SAPermissionsFilter } from "./SAPermissionsFilter";
import { SAPermissionsList } from "./SAPermissionsList";
import { SAPermissionsTable } from "./SAPermissionsTable";
import { SAHealthProductProvider } from "./providers/SAHealthProductProvider";
import { SAPModalProvider } from "./providers/SAPModalProvider";

function SAHealthProduct() {
    const { width: windowWidth } = useWindowSize();
    const { isNonRTS_User } = useRoles();

    const isMobile = windowWidth <= 784;

    if (isNonRTS_User) {
        return <InforBanner PopupModal={NonRTSModal} showModal={true} />;
    }

    return (
        <SAPModalProvider>
            <SAHealthProductProvider>
                {!isMobile && <SAPermissionsTable />}
                {isMobile && (
                    <>
                        <SAPermissionsFilter />
                        <SAPermissionsList />
                    </>
                )}
                <SAAddPermissionRow />
            </SAHealthProductProvider>
            <SAExpiredModal />
            <ErrorModal />
        </SAPModalProvider>
    );
}

export default SAHealthProduct;
